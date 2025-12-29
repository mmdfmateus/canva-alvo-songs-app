/* eslint-disable no-console */
import {
  addPage,
  createRichtextRange,
  getDesignMetadata,
  openDesign,
} from "@canva/design";
import { CanvaError } from "@canva/error";
import type { SlideContent } from "./lyricsProcessor";

// Styling constants
const DEFAULT_BACKGROUND_COLOR = "#FFFFFF"; // Default white color (can be overridden)
const TEXT_COLOR = "#000000"; // Black color
const FONT_SIZE = 48; // Base font size in pixels
const TITLE_SLIDE_FONT_SIZE = 80; // Larger font size for dedicated title slide
const LINE_HEIGHT = 1.4; // Line height multiplier
const VERTICAL_PADDING_RATIO = 0.1; // Vertical padding as ratio of page height

export interface CreateSlidesResult {
  success: boolean;
  pagesCreated: number;
  totalSlides: number;
  error?: string;
}

export interface SlideStyleOptions {
  backgroundColor?: string; // Background color for slides (defaults to DEFAULT_BACKGROUND_COLOR)
  textColor?: string; // Text color (defaults to white)
}

// Rate limiting: Canva allows max 3 pages per second
// However, in practice, we're seeing rate limits even with 1.5+ second delays
// The issue appears to be that Canva uses a longer rolling window (possibly 2-3 seconds)
// or other API calls (like openDesign in getCurrentPageBackgroundColor) contribute to the limit
// Optimized: Using 2.5 seconds between pages - slower than ideal but reliable
const MAX_PAGES_PER_SECOND = 1; // Very conservative: 1 page per second
const MIN_DELAY_BETWEEN_PAGES_MS = 2000; // Minimum 2.5 seconds between pages (optimized from 2s, still safe)
const RATE_LIMIT_WINDOW_MS = 3000; // 2.5 second window (optimized from 3s, still accounts for server-side tracking)
const SAFETY_BUFFER_MS = 200; // Safety buffer (reduced from 200ms for slight optimization)

// Track recent page creation timestamps for rate limiting
let recentPageCreations: number[] = [];

/**
 * Cleans up old timestamps outside the rate limit window
 */
function cleanupOldTimestamps(now: number): void {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const beforeCount = recentPageCreations.length;
  recentPageCreations = recentPageCreations.filter((ts) => ts > cutoff);
  const afterCount = recentPageCreations.length;
  if (beforeCount !== afterCount) {
    console.log(
      `[Rate Limit] Cleaned up ${beforeCount - afterCount} old timestamps. Remaining: ${afterCount}`,
    );
  }
}

/**
 * Calculates the delay needed before creating the next page to respect rate limits.
 * Uses a sliding window approach to ensure we never exceed MAX_PAGES_PER_SECOND.
 *
 * @returns The delay in milliseconds before the next page can be created
 */
function calculateRateLimitDelay(): number {
  const now = Date.now();
  cleanupOldTimestamps(now);

  console.log(
    `[Rate Limit] Calculating delay. Recent creations in window: ${recentPageCreations.length}/${MAX_PAGES_PER_SECOND}`,
  );

  // If we have fewer than MAX_PAGES_PER_SECOND in the window, we can proceed
  if (recentPageCreations.length < MAX_PAGES_PER_SECOND) {
    // Ensure minimum delay between pages
    if (recentPageCreations.length > 0) {
      const lastCreation = recentPageCreations[recentPageCreations.length - 1];
      if (lastCreation !== undefined) {
        const timeSinceLastCreation = now - lastCreation;
        console.log(
          `[Rate Limit] Time since last creation: ${timeSinceLastCreation}ms (min: ${MIN_DELAY_BETWEEN_PAGES_MS}ms)`,
        );
        if (timeSinceLastCreation < MIN_DELAY_BETWEEN_PAGES_MS) {
          const delay = MIN_DELAY_BETWEEN_PAGES_MS - timeSinceLastCreation;
          console.log(`[Rate Limit] Need to wait ${delay}ms for minimum delay`);
          return delay;
        }
      }
    }
    console.log(`[Rate Limit] No delay needed`);
    return 0;
  }

  // We've hit the limit - wait until the oldest creation falls outside the window
  const oldestCreation = recentPageCreations[0];
  if (oldestCreation === undefined) {
    // Should not happen, but fallback to minimum delay
    console.warn(
      `[Rate Limit] WARNING: Hit limit but oldestCreation is undefined. Using minimum delay.`,
    );
    return MIN_DELAY_BETWEEN_PAGES_MS;
  }
  const timeSinceOldest = now - oldestCreation;
  const waitTime = RATE_LIMIT_WINDOW_MS - timeSinceOldest + SAFETY_BUFFER_MS;
  const finalDelay = Math.max(waitTime, MIN_DELAY_BETWEEN_PAGES_MS);
  console.log(
    `[Rate Limit] HIT LIMIT! Time since oldest: ${timeSinceOldest}ms, window: ${RATE_LIMIT_WINDOW_MS}ms, calculated wait: ${waitTime}ms, final delay: ${finalDelay}ms`,
  );
  return finalDelay;
}

/**
 * Records a page creation timestamp for rate limiting
 */
function recordPageCreation(): void {
  const now = Date.now();
  cleanupOldTimestamps(now);
  recentPageCreations.push(now);
  console.log(
    `[Rate Limit] Recorded page creation at ${now}. Total in window: ${recentPageCreations.length}. Timestamps: [${recentPageCreations.map((ts) => now - ts).join(", ")}]ms ago`,
  );
}

/**
 * Gets the background color of the current page in the Canva design.
 * Returns the color as a hex string (e.g., "#FF6B35") or null if not available.
 *
 * @returns Promise that resolves to the background color hex string or null
 */
export async function getCurrentPageBackgroundColor(): Promise<string | null> {
  try {
    let backgroundColor: string | null = null;

    await openDesign({ type: "current_page" }, async (session) => {
      if (session.page.type !== "absolute") {
        return;
      }

      const background = session.page.background;
      if (background?.colorContainer?.ref?.type === "solid") {
        backgroundColor = background.colorContainer.ref.color;
      }
    });

    return backgroundColor;
  } catch {
    // If we can't get the background color, return null
    // The caller should handle this gracefully
    return null;
  }
}

/**
 * Creates a dedicated title slide with the song title and artist (if available).
 *
 * @param songTitle The song title
 * @param artist The artist name (can be null, undefined, or empty)
 * @param styleOptions Styling options for the slide
 * @returns Promise that resolves when the title slide is created
 */
async function createTitleSlide(
  songTitle: string,
  artist: string | null | undefined,
  styleOptions: SlideStyleOptions,
  pageDimensions: { width: number; height: number },
): Promise<void> {
  const backgroundColor =
    styleOptions.backgroundColor || DEFAULT_BACKGROUND_COLOR;
  const textColor = styleOptions.textColor || TEXT_COLOR;

  // Check if artist is valid (not null, undefined, or empty)
  const hasValidArtist = artist != null && artist.trim().length > 0;

  // Calculate text positioning with proper margins to avoid clipping
  const horizontalPadding = pageDimensions.width * 0.1; // 10% horizontal padding
  const textWidth = pageDimensions.width - horizontalPadding * 2;
  const textLeft = (pageDimensions.width - textWidth) / 2; // Center horizontally
  const verticalPadding = pageDimensions.height * VERTICAL_PADDING_RATIO;

  // Create richtext range for the title slide
  const range = createRichtextRange();

  // Add title
  range.appendText(songTitle, {
    color: textColor,
    fontWeight: "bold",
  });

  // Add artist only if it's valid
  if (hasValidArtist) {
    range.appendText("\n\n" + artist, {
      color: textColor,
    });
  }

  // Format title
  range.formatParagraph(
    { index: 0, length: songTitle.length },
    {
      fontSize: TITLE_SLIDE_FONT_SIZE,
      textAlign: "center",
      color: textColor,
      fontWeight: "bold",
    },
  );

  // Format artist only if it exists
  if (hasValidArtist && artist) {
    range.formatParagraph(
      { index: songTitle.length + 2, length: artist.length },
      {
        fontSize: FONT_SIZE,
        textAlign: "center",
        color: textColor,
      },
    );
  }

  // Position vertically, slightly above center for better visual balance
  const estimatedTitleHeight = TITLE_SLIDE_FONT_SIZE * LINE_HEIGHT;
  const estimatedArtistHeight = hasValidArtist
    ? FONT_SIZE * LINE_HEIGHT * 1.5
    : 0;
  const totalTextHeight = estimatedTitleHeight + estimatedArtistHeight;

  // Calculate the maximum top position to prevent bottom clipping
  const maxAllowedTop =
    pageDimensions.height - totalTextHeight - verticalPadding;

  // Calculate position slightly above center for better visual balance
  const offsetFromCenter = pageDimensions.height * 0.05; // Move up by 5% of page height
  const centeredTop =
    (pageDimensions.height - totalTextHeight) / 2 - offsetFromCenter;

  // Use adjusted position if it fits, otherwise use the maximum allowed position
  // Ensure it's never less than the vertical padding
  const finalTextTop = Math.max(
    verticalPadding,
    Math.min(centeredTop, maxAllowedTop),
  );

  // Wait for rate limit before creating page
  const delay = calculateRateLimitDelay();
  if (delay > 0) {
    console.log(
      `[Title Slide] Waiting ${delay}ms before creating title page...`,
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Create the title page
  console.log(`[Title Slide] Creating title page...`);
  const titlePageStartTime = Date.now();
  await addPage({
    title: `Title: ${songTitle}`,
    elements: [
      {
        type: "richtext",
        range,
        top: finalTextTop,
        left: textLeft,
        width: textWidth,
      },
    ],
    background: {
      color: backgroundColor,
    },
  });
  const titlePageEndTime = Date.now();

  // Record the page creation AFTER the API call completes
  // This ensures we track when Canva's server actually processed the request
  recordPageCreation();
  console.log(
    `[Title Slide] Title page created successfully in ${titlePageEndTime - titlePageStartTime}ms`,
  );
}

/**
 * Creates a complete set of slides for a song: title slide + lyrics slides.
 * First creates a dedicated title slide, then creates slides with lyrics.
 *
 * @param slides Array of slide content to create
 * @param songTitle The song title
 * @param artist The artist name (can be null, undefined, or empty)
 * @param styleOptions Styling options for the slides
 * @param onProgress Optional callback to report progress (current, total)
 */
export async function createSongSlides(
  slides: SlideContent[],
  songTitle: string,
  artist: string | null | undefined,
  styleOptions?: SlideStyleOptions,
  onProgress?: (current: number, total: number) => void,
): Promise<CreateSlidesResult> {
  try {
    const designMetadata = await getDesignMetadata();
    const pageDimensions = designMetadata.defaultPageDimensions;

    if (!pageDimensions) {
      return {
        success: false,
        pagesCreated: 0,
        totalSlides: slides.length + 1, // +1 for title slide
        error:
          "As dimensões da página não estão disponíveis. Por favor, certifique-se de que está em um tipo de design suportado.",
      };
    }

    // If no background color is provided, try to get it from the current page
    let finalStyleOptions = styleOptions;
    if (!styleOptions?.backgroundColor) {
      const currentPageColor = await getCurrentPageBackgroundColor();
      if (currentPageColor) {
        finalStyleOptions = {
          ...styleOptions,
          backgroundColor: currentPageColor,
        };
      }
    }

    let pagesCreated = 0;
    const totalSlides = slides.length + 1; // Include title slide in total

    // Reset rate limit tracking at the start of a new batch
    // This ensures we start with a clean slate
    console.log(
      `[createSongSlides] Starting new batch. Resetting rate limit tracking. Total slides: ${totalSlides}`,
    );
    recentPageCreations = [];

    // Create title slide first
    try {
      console.log(
        `[createSongSlides] Creating title slide (1/${totalSlides})...`,
      );
      onProgress?.(1, totalSlides);
      await createTitleSlide(
        songTitle,
        artist,
        finalStyleOptions || {},
        pageDimensions,
      );
      pagesCreated++;
      console.log(
        `[createSongSlides] Title slide created successfully. Pages created: ${pagesCreated}`,
      );
    } catch (titleError) {
      console.error(
        `[createSongSlides] Error creating title slide:`,
        titleError,
      );
      if (titleError instanceof CanvaError) {
        console.error(
          `[createSongSlides] CanvaError code: ${titleError.code}, message: ${titleError.message}`,
        );
        if (titleError.code === "quota_exceeded") {
          return {
            success: false,
            pagesCreated: 0,
            totalSlides,
            error:
              "Desculpe, você não pode adicionar mais páginas. Por favor, remova algumas páginas existentes e tente novamente.",
          };
        }
        if (titleError.code === "rate_limited") {
          // If rate limited, wait longer and retry once
          // Use exponential backoff: wait for the full window plus buffer
          const retryDelay = RATE_LIMIT_WINDOW_MS + SAFETY_BUFFER_MS * 2; // Full window + extra buffer
          console.warn(
            `[createSongSlides] RATE LIMITED on title slide! Waiting ${retryDelay}ms before retry...`,
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));

          // Clear recent timestamps to reset the window
          console.log(
            `[createSongSlides] Resetting rate limit tracking for retry`,
          );
          recentPageCreations = [];

          try {
            console.log(`[createSongSlides] Retrying title slide creation...`);
            await createTitleSlide(
              songTitle,
              artist,
              finalStyleOptions || {},
              pageDimensions,
            );
            pagesCreated++;
            console.log(
              `[createSongSlides] Title slide retry successful. Pages created: ${pagesCreated}`,
            );
          } catch (retryError) {
            console.error(
              `[createSongSlides] Title slide retry failed:`,
              retryError,
            );
            return {
              success: false,
              pagesCreated: 0,
              totalSlides,
              error:
                "Desculpe, você só pode adicionar até 3 páginas por segundo. Por favor, tente novamente em um momento.",
            };
          }
        } else {
          throw titleError;
        }
      } else {
        throw titleError;
      }
    }

    // Create lyrics slides
    console.log(
      `[createSongSlides] Starting lyrics slides creation (${slides.length} slides)...`,
    );
    const lyricsResult = await createSlidesWithLyrics(
      slides,
      songTitle,
      finalStyleOptions,
      (current, total) => {
        // Adjust progress to account for title slide (current + 1, total + 1)
        onProgress?.(current + 1, total + 1);
      },
    );

    // Combine results
    pagesCreated += lyricsResult.pagesCreated;

    return {
      success: lyricsResult.success,
      pagesCreated,
      totalSlides,
      error: lyricsResult.error,
    };
  } catch (error) {
    if (error instanceof CanvaError) {
      let errorMessage = "Ocorreu um erro ao criar os slides.";

      switch (error.code) {
        case "quota_exceeded":
          errorMessage =
            "Desculpe, você não pode adicionar mais páginas. Por favor, remova algumas páginas existentes e tente novamente.";
          break;
        case "rate_limited":
          errorMessage =
            "Desculpe, você só pode adicionar até 3 páginas por segundo. Por favor, tente novamente em um momento.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      return {
        success: false,
        pagesCreated: 0,
        totalSlides: slides.length + 1,
        error: errorMessage,
      };
    }

    return {
      success: false,
      pagesCreated: 0,
      totalSlides: slides.length + 1,
      error:
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado ao criar os slides.",
    };
  }
}

/**
 * Creates styled slides with lyrics content.
 * Each slide has a configurable background color with white centered text.
 *
 * @param slides Array of slide content to create
 * @param songTitle Optional title to display (for progress tracking)
 * @param styleOptions Styling options for the slides
 * @param onProgress Optional callback to report progress (current, total)
 */
export async function createSlidesWithLyrics(
  slides: SlideContent[],
  songTitle?: string,
  styleOptions?: SlideStyleOptions,
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
          "As dimensões da página não estão disponíveis. Por favor, certifique-se de que está em um tipo de design suportado.",
      };
    }

    const backgroundColor =
      styleOptions?.backgroundColor || DEFAULT_BACKGROUND_COLOR;
    const textColor = styleOptions?.textColor || TEXT_COLOR;

    let pagesCreated = 0;
    const totalSlides = slides.length;

    // Create each slide with rate limiting
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (!slide) continue;

      // Calculate and wait for rate limit delay
      console.log(
        `[Lyrics Slide ${i + 1}] Calculating rate limit delay before creating slide...`,
      );
      const delay = calculateRateLimitDelay();
      if (delay > 0) {
        // Report progress before delay to keep UX responsive
        console.log(
          `[Lyrics Slide ${i + 1}] Waiting ${delay}ms before creating slide...`,
        );
        onProgress?.(i + 1, totalSlides);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Report progress if no delay needed
        onProgress?.(i + 1, totalSlides);
      }

      // Calculate text positioning with proper margins to avoid clipping
      const verticalPadding = pageDimensions.height * VERTICAL_PADDING_RATIO;
      const horizontalPadding = pageDimensions.width * 0.1; // 10% horizontal padding
      const textWidth = pageDimensions.width - horizontalPadding * 2;
      const textLeft = (pageDimensions.width - textWidth) / 2; // Center horizontally

      // Create richtext range for the slide content
      const range = createRichtextRange();

      // Add lyrics lines
      for (let j = 0; j < slide.lines.length; j++) {
        const line = slide.lines[j];
        if (!line) continue;
        const isLastLine = j === slide.lines.length - 1;

        range.appendText(line, {
          color: textColor,
        });

        if (!isLastLine) {
          range.appendText("\n", {
            color: textColor,
          });
        }
      }

      // Format the entire content to center align and set font sizes
      const totalLength = range.readPlaintext().length;
      if (totalLength > 0) {
        range.formatParagraph(
          { index: 0, length: totalLength },
          {
            fontSize: FONT_SIZE,
            textAlign: "center",
            color: textColor,
          },
        );
      }

      // Calculate text height (approximate based on line count)
      const estimatedLineHeight = FONT_SIZE * LINE_HEIGHT;
      const lyricsHeight = slide.lines.length * estimatedLineHeight;

      // Position vertically, slightly above center for better visual balance
      // Calculate the maximum top position to prevent bottom clipping
      const maxAllowedTop =
        pageDimensions.height - lyricsHeight - verticalPadding;

      // Calculate position slightly above center for better visual balance
      const offsetFromCenter = pageDimensions.height * 0.05; // Move up by 5% of page height
      const centeredTop =
        (pageDimensions.height - lyricsHeight) / 2 - offsetFromCenter;

      // Use adjusted position if it fits, otherwise use the maximum allowed position
      // Ensure it's never less than the vertical padding
      const finalTextTop = Math.max(
        verticalPadding,
        Math.min(centeredTop, maxAllowedTop),
      );

      // Create the page with background and text
      try {
        console.log(`[Lyrics Slide ${i + 1}] Creating page...`);
        const slideStartTime = Date.now();
        await addPage({
          title: `Slide ${i + 1}`,
          elements: [
            {
              type: "richtext",
              range,
              top: finalTextTop,
              left: textLeft,
              width: textWidth,
            },
          ],
          background: {
            color: backgroundColor,
          },
        });
        const slideEndTime = Date.now();

        // Record the page creation AFTER the API call completes
        // This ensures we track when Canva's server actually processed the request
        recordPageCreation();
        console.log(
          `[Lyrics Slide ${i + 1}] Page created successfully in ${slideEndTime - slideStartTime}ms. Total pages: ${pagesCreated + 1}`,
        );
        pagesCreated++;
      } catch (pageError) {
        // If we hit an error mid-process, return partial success
        console.error(
          `[Lyrics Slide ${i + 1}] Error creating page:`,
          pageError,
        );
        if (pageError instanceof CanvaError) {
          console.error(
            `[Lyrics Slide ${i + 1}] CanvaError code: ${pageError.code}, message: ${pageError.message}`,
          );
          if (pageError.code === "quota_exceeded") {
            return {
              success: pagesCreated > 0,
              pagesCreated,
              totalSlides,
              error:
                pagesCreated > 0
                  ? `Criado${pagesCreated > 1 ? "s" : ""} ${pagesCreated} de ${totalSlides} slide${
                      pagesCreated > 1 ? "s" : ""
                    } com sucesso. Não é possível adicionar mais páginas - por favor, remova algumas páginas existentes e tente novamente.`
                  : "Desculpe, você não pode adicionar mais páginas. Por favor, remova algumas páginas existentes e tente novamente.",
            };
          }
          if (pageError.code === "rate_limited") {
            // If rate limited, wait longer and retry once
            // Use exponential backoff: wait for the full window plus buffer
            const retryDelay = RATE_LIMIT_WINDOW_MS + SAFETY_BUFFER_MS * 2; // Full window + extra buffer
            console.warn(
              `[Lyrics Slide ${i + 1}] RATE LIMITED! Waiting ${retryDelay}ms before retry...`,
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));

            // Clear recent timestamps to reset the window
            console.log(
              `[Lyrics Slide ${i + 1}] Resetting rate limit tracking for retry`,
            );
            recentPageCreations = [];

            try {
              console.log(`[Lyrics Slide ${i + 1}] Retrying page creation...`);
              const retryStartTime = Date.now();
              await addPage({
                title: `Slide ${i + 1}`,
                elements: [
                  {
                    type: "richtext",
                    range,
                    top: finalTextTop,
                    left: textLeft,
                    width: textWidth,
                  },
                ],
                background: {
                  color: backgroundColor,
                },
              });
              const retryEndTime = Date.now();

              // Record AFTER the retry API call completes
              recordPageCreation();
              console.log(
                `[Lyrics Slide ${i + 1}] Retry successful in ${retryEndTime - retryStartTime}ms. Total pages: ${pagesCreated + 1}`,
              );
              pagesCreated++;
            } catch (retryError) {
              console.error(
                `[Lyrics Slide ${i + 1}] Retry failed:`,
                retryError,
              );
              return {
                success: pagesCreated > 0,
                pagesCreated,
                totalSlides,
                error:
                  pagesCreated > 0
                    ? `Criado${pagesCreated > 1 ? "s" : ""} ${pagesCreated} de ${totalSlides} slide${
                        pagesCreated > 1 ? "s" : ""
                      } com sucesso. Limite de taxa excedido - por favor, aguarde um momento e tente novamente.`
                    : "Desculpe, você só pode adicionar até 3 páginas por segundo. Por favor, tente novamente em um momento.",
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
      let errorMessage = "Ocorreu um erro ao criar os slides.";

      switch (error.code) {
        case "quota_exceeded":
          errorMessage =
            "Desculpe, você não pode adicionar mais páginas. Por favor, remova algumas páginas existentes e tente novamente.";
          break;
        case "rate_limited":
          errorMessage =
            "Desculpe, você só pode adicionar até 3 páginas por segundo. Por favor, tente novamente em um momento.";
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
          : "Ocorreu um erro inesperado ao criar os slides.",
    };
  }
}
