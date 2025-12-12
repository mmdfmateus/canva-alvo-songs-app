import {
  Alert,
  LoadingIndicator,
  ProgressBar,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import { notification } from "@canva/platform";
import { useFeatureSupport } from "@canva/app-hooks";
import { addPage } from "@canva/design";
import { useState, useEffect } from "react";
import { SongBrowser } from "../../components/SongBrowser";
import songsData from "../../data/songs.json";
import { splitLyricsIntoSlides, type Song } from "../../utils/lyricsProcessor";
import {
  createSlidesWithLyrics,
  type CreateSlidesResult,
} from "../../utils/slideCreator";
import * as styles from "styles/components.css";

export const App = () => {
  const [songs] = useState<Song[]>(songsData as Song[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const isSupported = useFeatureSupport();
  const isAddPageSupported = isSupported(addPage);

  useEffect(() => {
    // Check if addPage is supported in the current design type
    if (!isAddPageSupported) {
      setError(
        "Adding pages is not supported in the current design type. Please open a Presentation design.",
      );
    } else {
      setError(undefined);
    }
  }, [isAddPageSupported]);

  const handleSongSelect = async (song: Song) => {
    if (!isAddPageSupported) {
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setProgress(null);

    try {
      // Split lyrics into slides
      const slides = splitLyricsIntoSlides(song.lyrics);

      if (slides.length === 0) {
        setError("This song has no lyrics to display.");
        setIsLoading(false);
        return;
      }

      // Create slides with styled content and progress tracking
      const result: CreateSlidesResult = await createSlidesWithLyrics(
        slides,
        song.title,
        (current, total) => {
          setProgress({ current, total });
        },
      );

      // Clear progress
      setProgress(null);

      if (result.success) {
        // Show success notification
        await notification.addToast({
          messageText: `Successfully added ${result.pagesCreated} slide${
            result.pagesCreated > 1 ? "s" : ""
          } with lyrics from "${song.title}"!`,
          timeoutMs: 5000,
        });
        setError(undefined);
      } else {
        // Show error, but also show partial success if some pages were created
        setError(result.error || "Failed to create slides.");
        if (result.pagesCreated > 0) {
          await notification.addToast({
            messageText: `Created ${result.pagesCreated} of ${result.totalSlides} slides. ${result.error}`,
            timeoutMs: 7000,
          });
        }
      }
    } catch (err) {
      setProgress(null);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while creating slides.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        {error && <Alert tone="critical">{error}</Alert>}

        {!isAddPageSupported && !error && (
          <Alert tone="warn">
            Adding pages is not supported in the current design type. Please
            open a Presentation design to use this app.
          </Alert>
        )}

        {isLoading && progress && (
          <Rows spacing="2u">
            <Text>
              Adding pages: {progress.current} of {progress.total}
            </Text>
            <ProgressBar
              value={Math.round((progress.current / progress.total) * 100)}
            />
            <Text tone="tertiary" size="small">
              Please wait while pages are being created. This may take a moment
              for longer songs.
            </Text>
          </Rows>
        )}

        {isLoading && !progress && (
          <Rows spacing="2u">
            <LoadingIndicator />
            <Text tone="tertiary">Preparing slides...</Text>
          </Rows>
        )}

        <SongBrowser
          songs={songs}
          onSelectSong={handleSongSelect}
          isLoading={isLoading || !isAddPageSupported}
        />
      </Rows>
    </div>
  );
};
