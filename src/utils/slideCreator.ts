import { addPage, createRichtextRange, getDesignMetadata } from "@canva/design";
import { CanvaError } from "@canva/error";
import type { SlideContent } from "./lyricsProcessor";

// Styling constants matching the orange/white theme
const BACKGROUND_COLOR = "#FF6B35"; // Orange color
const TEXT_COLOR = "#FFFFFF"; // White color
const FONT_SIZE = 48; // Base font size in pixels
const TITLE_FONT_SIZE = 64; // Title font size
const LINE_HEIGHT = 1.4; // Line height multiplier
const TEXT_WIDTH_RATIO = 0.8; // Text width as ratio of page width
const VERTICAL_PADDING_RATIO = 0.1; // Vertical padding as ratio of page height

export interface CreateSlidesResult {
  success: boolean;
  pagesCreated: number;
  totalSlides: number;
  error?: string;
}

// Rate limiting: Canva allows max 3 pages per second
// We'll add a small delay to ensure we stay under the limit
const RATE_LIMIT_DELAY_MS = 600; // ~2.5 pages per second to be safe

/**
 * Creates styled slides with lyrics content.
 * Each slide has an orange background with white centered text.
 *
 * @param slides Array of slide content to create
 * @param songTitle Optional title to display on the first slide
 * @param onProgress Optional callback to report progress (current, total)
 */
export async function createSlidesWithLyrics(
  slides: SlideContent[],
  songTitle?: string,
  onProgress?: (current: number, total: number) => void,
): Promise<CreateSlidesResult> {
  try {
    const designMetadata = await getDesignMetadata();
    const pageDimensions = designMetadata.defaultPageDimensions;

    if (!pageDimensions) {
      return {
        success: false,
        pagesCreated: 0,
        totalSlides: slides.length,
        error:
          "Page dimensions are not available. Please ensure you're in a supported design type.",
      };
    }

    let pagesCreated = 0;
    const totalSlides = slides.length;

    // Create each slide with rate limiting
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (!slide) continue;
      const isFirstSlide = i === 0;

      // Add delay between pages to respect rate limit (except for first page)
      if (i > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, RATE_LIMIT_DELAY_MS),
        );
      }

      // Report progress
      onProgress?.(i + 1, totalSlides);

      // Calculate text positioning
      const textWidth = pageDimensions.width * TEXT_WIDTH_RATIO;
      const textLeft = (pageDimensions.width - textWidth) / 2;
      const verticalPadding = pageDimensions.height * VERTICAL_PADDING_RATIO;

      // Create richtext range for the slide content
      const range = createRichtextRange();

      // Add title on first slide if provided
      if (isFirstSlide && songTitle) {
        range.appendText(songTitle + "\n\n", {
          color: TEXT_COLOR,
          fontWeight: "bold",
        });
      }

      // Add lyrics lines
      for (let j = 0; j < slide.lines.length; j++) {
        const line = slide.lines[j];
        if (!line) continue;
        const isLastLine = j === slide.lines.length - 1;

        range.appendText(line, {
          color: TEXT_COLOR,
        });

        if (!isLastLine) {
          range.appendText("\n", {
            color: TEXT_COLOR,
          });
        }
      }

      // Format the entire content to center align and set font sizes
      const totalLength = range.readPlaintext().length;
      if (totalLength > 0) {
        // Format title paragraph if it exists
        if (isFirstSlide && songTitle) {
          const titleLength = songTitle.length + 2; // +2 for "\n\n"
          range.formatParagraph(
            { index: 0, length: titleLength },
            {
              fontSize: TITLE_FONT_SIZE,
              textAlign: "center",
              color: TEXT_COLOR,
            },
          );
        }

        // Format lyrics paragraphs
        const lyricsStartIndex =
          isFirstSlide && songTitle ? songTitle.length + 2 : 0;
        range.formatParagraph(
          { index: lyricsStartIndex, length: totalLength - lyricsStartIndex },
          {
            fontSize: FONT_SIZE,
            textAlign: "center",
            color: TEXT_COLOR,
          },
        );
      }

      // Calculate text height (approximate based on line count)
      const estimatedLineHeight = FONT_SIZE * LINE_HEIGHT;
      const titleHeight = songTitle && isFirstSlide ? TITLE_FONT_SIZE * 2 : 0;
      const lyricsHeight = slide.lines.length * estimatedLineHeight;
      const totalTextHeight = titleHeight + lyricsHeight;
      const textTop = (pageDimensions.height - totalTextHeight) / 2;

      // Create the page with background and text
      try {
        await addPage({
          title: `Slide ${i + 1}`,
          elements: [
            {
              type: "richtext",
              range,
              top: Math.max(verticalPadding, textTop),
              left: textLeft,
              width: textWidth,
            },
          ],
          background: {
            color: BACKGROUND_COLOR,
          },
        });

        pagesCreated++;
      } catch (pageError) {
        // If we hit an error mid-process, return partial success
        if (pageError instanceof CanvaError) {
          if (pageError.code === "quota_exceeded") {
            return {
              success: pagesCreated > 0,
              pagesCreated,
              totalSlides,
              error:
                pagesCreated > 0
                  ? `Successfully created ${pagesCreated} of ${totalSlides} slides. Cannot add more pages - please remove some existing pages and try again.`
                  : "Sorry, you cannot add any more pages. Please remove some existing pages and try again.",
            };
          }
          if (pageError.code === "rate_limited") {
            // If rate limited, wait a bit longer and retry once
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
              await addPage({
                title: `Slide ${i + 1}`,
                elements: [
                  {
                    type: "richtext",
                    range,
                    top: Math.max(verticalPadding, textTop),
                    left: textLeft,
                    width: textWidth,
                  },
                ],
                background: {
                  color: BACKGROUND_COLOR,
                },
              });
              pagesCreated++;
            } catch {
              return {
                success: pagesCreated > 0,
                pagesCreated,
                totalSlides,
                error:
                  pagesCreated > 0
                    ? `Successfully created ${pagesCreated} of ${totalSlides} slides. Rate limit exceeded - please wait a moment and try again.`
                    : "Sorry, you can only add up to 3 pages per second. Please try again in a moment.",
              };
            }
          } else {
            // Other Canva errors
            throw pageError;
          }
        } else {
          throw pageError;
        }
      }
    }

    return {
      success: true,
      pagesCreated,
      totalSlides,
    };
  } catch (error) {
    if (error instanceof CanvaError) {
      let errorMessage = "An error occurred while creating slides.";

      switch (error.code) {
        case "quota_exceeded":
          errorMessage =
            "Sorry, you cannot add any more pages. Please remove some existing pages and try again.";
          break;
        case "rate_limited":
          errorMessage =
            "Sorry, you can only add up to 3 pages per second. Please try again in a moment.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      return {
        success: false,
        pagesCreated: 0,
        totalSlides: slides.length,
        error: errorMessage,
      };
    }

    return {
      success: false,
      pagesCreated: 0,
      totalSlides: slides.length,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating slides.",
    };
  }
}
