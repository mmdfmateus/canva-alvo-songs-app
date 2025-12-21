export interface Song {
  id: string;
  title: string;
  artist: string | null | undefined;
  lyrics: string[];
}

export interface SlideContent {
  lines: string[];
}

/**
 * Splits song lyrics into slides with configurable lines per slide.
 * Handles edge cases for very short or long songs.
 */
export function splitLyricsIntoSlides(
  lyrics: string[],
  minLinesPerSlide: number = 3,
  maxLinesPerSlide: number = 4,
): SlideContent[] {
  if (lyrics.length === 0) {
    return [];
  }

  const slides: SlideContent[] = [];
  const filteredLyrics = lyrics.filter((line) => line.trim().length > 0);

  if (filteredLyrics.length === 0) {
    return [];
  }

  // For very short songs (less than minLinesPerSlide), put everything on one slide
  if (filteredLyrics.length <= minLinesPerSlide) {
    return [{ lines: filteredLyrics }];
  }

  let currentSlide: string[] = [];
  let currentLineCount = 0;

  for (const line of filteredLyrics) {
    // If adding this line would exceed maxLinesPerSlide, start a new slide
    if (
      currentLineCount >= minLinesPerSlide &&
      currentLineCount + 1 > maxLinesPerSlide
    ) {
      slides.push({ lines: [...currentSlide] });
      currentSlide = [line];
      currentLineCount = 1;
    } else {
      currentSlide.push(line);
      currentLineCount++;
    }
  }

  // Add the last slide if it has content
  if (currentSlide.length > 0) {
    slides.push({ lines: currentSlide });
  }

  return slides;
}

