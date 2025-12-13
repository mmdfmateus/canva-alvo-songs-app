import {
  Alert,
  ColorSelector,
  Columns,
  Column,
  LoadingIndicator,
  ProgressBar,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { notification } from "@canva/platform";
import { useFeatureSupport } from "@canva/app-hooks";
import { addPage } from "@canva/design";
import { useState, useEffect } from "react";
import { SongBrowser } from "../../components/SongBrowser";
import songsData from "../../data/songs.json";
import { splitLyricsIntoSlides, type Song } from "../../utils/lyricsProcessor";
import {
  createSongSlides,
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
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(
    undefined,
  );
  const [textColor, setTextColor] = useState<string | undefined>(undefined);
  const isSupported = useFeatureSupport();
  const isAddPageSupported = isSupported(addPage);

  useEffect(() => {
    // Verifica se addPage é suportado no tipo de design atual
    if (!isAddPageSupported) {
      setError(
        "Adicionar páginas não é suportado no tipo de design atual. Por favor, abra um design de Apresentação.",
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
      // Divide a letra em slides
      const slides = splitLyricsIntoSlides(song.lyrics);

      if (slides.length === 0) {
        setError("Esta música não tem letra para exibir.");
        setIsLoading(false);
        return;
      }

      // Create slides with styled content and progress tracking
      // First creates a title slide, then lyrics slides
      const styleOptions: { backgroundColor?: string; textColor?: string } = {};
      if (backgroundColor) {
        styleOptions.backgroundColor = backgroundColor;
      }
      if (textColor) {
        styleOptions.textColor = textColor;
      }
      const result: CreateSlidesResult = await createSongSlides(
        slides,
        song.title,
        song.artist,
        Object.keys(styleOptions).length > 0 ? styleOptions : undefined, // Use selected colors or adapt to existing presentation
        (current, total) => {
          setProgress({ current, total });
        },
      );

      // Clear progress
      setProgress(null);

      if (result.success) {
        // Mostra notificação de sucesso
        await notification.addToast({
          messageText: `Adicionado${result.pagesCreated > 1 ? "s" : ""} ${result.pagesCreated} slide${
            result.pagesCreated > 1 ? "s" : ""
          } com a letra de "${song.title}"!`,
          timeoutMs: 5000,
        });
        setError(undefined);
      } else {
        // Mostra erro, mas também mostra sucesso parcial se algumas páginas foram criadas
        setError(result.error || "Falha ao criar slides.");
        if (result.pagesCreated > 0) {
          await notification.addToast({
            messageText: `Criado${result.pagesCreated > 1 ? "s" : ""} ${result.pagesCreated} de ${result.totalSlides} slide${
              result.pagesCreated > 1 ? "s" : ""
            }. ${result.error}`,
            timeoutMs: 7000,
          });
        }
      }
    } catch (err) {
      setProgress(null);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado ao criar os slides.";
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
            Adicionar páginas não é suportado no tipo de design atual. Por
            favor, abra um design de Apresentação para usar este app.
          </Alert>
        )}

        {isLoading && progress && (
          <Rows spacing="2u">
            <Text>
              Adicionando páginas: {progress.current} de {progress.total}
            </Text>
            <ProgressBar
              value={Math.round((progress.current / progress.total) * 100)}
            />
            <Text tone="tertiary" size="small">
              Aguarde enquanto as páginas estão sendo criadas. Isso pode levar
              um momento para músicas mais longas.
            </Text>
          </Rows>
        )}

        {isLoading && !progress && (
          <Rows spacing="2u">
            <LoadingIndicator />
            <Text tone="tertiary">Preparando slides...</Text>
          </Rows>
        )}

        {!isLoading && (
          <Rows spacing="2u">
            <Title size="small">Cores</Title>
            <Columns spacing="2u">
              <Column width="1/2">
                <Rows spacing="1u">
                  <Text size="small">Fundo</Text>
                  <ColorSelector
                    color={backgroundColor || "#FFFFFF"}
                    onChange={(color) => {
                      setBackgroundColor(color);
                    }}
                  />
                </Rows>
              </Column>
              <Column width="1/2">
                <Rows spacing="1u">
                  <Text size="small">Texto</Text>
                  <ColorSelector
                    color={textColor || "#000000"}
                    onChange={(color) => {
                      setTextColor(color);
                    }}
                  />
                </Rows>
              </Column>
            </Columns>
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
