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
import { splitLyricsIntoSlides, type Song } from "../../utils/lyricsProcessor";
import {
  createSongSlides,
  type CreateSlidesResult,
} from "../../utils/slideCreator";
import { loadSongs } from "../../utils/songsLoader";
import {
  EXTERNAL_SONGS_URL,
  SONGS_CACHE_DURATION_MS,
  ENABLE_SONGS_CACHE,
} from "../../config/songsConfig";
import * as styles from "styles/components.css";

export const App = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
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
  const [minLinesPerSlide, setMinLinesPerSlide] = useState<number>(3);
  const [maxLinesPerSlide, setMaxLinesPerSlide] = useState<number>(4);
  const isSupported = useFeatureSupport();
  const isAddPageSupported = isSupported(addPage);

  // Load songs from external source or local fallback
  useEffect(() => {
    const loadSongsData = async () => {
      try {
        setIsLoadingSongs(true);

        const loadedSongs = await loadSongs({
          songsUrl: EXTERNAL_SONGS_URL,
          cacheDurationMs: SONGS_CACHE_DURATION_MS,
          enableCache: ENABLE_SONGS_CACHE,
        });

        setSongs(loadedSongs);
        console.log(`Loaded ${loadedSongs.length} songs`);
      } catch (error) {
        console.error("Error loading songs:", error);
        // Error is already handled by loadSongs with local fallback
        // But we can show a warning if needed
        setError("Erro ao carregar músicas. Usando dados locais.");
      } finally {
        setIsLoadingSongs(false);
      }
    };

    loadSongsData();
  }, []);

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
      // Divide a letra em slides com as configurações do usuário
      const slides = splitLyricsIntoSlides(
        song.lyrics,
        minLinesPerSlide,
        maxLinesPerSlide,
      );

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

        {isLoadingSongs && (
          <Rows spacing="2u">
            <LoadingIndicator />
            <Text tone="tertiary">Carregando músicas...</Text>
          </Rows>
        )}

        {!isLoading && !isLoadingSongs && (
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

        {!isLoading && !isLoadingSongs && (
          <Rows spacing="2u">
            <Title size="small">Configurações</Title>
            <Rows spacing="2u">
              <Columns spacing="2u">
                <Column width="1/2">
                  <Rows spacing="1u">
                    <Text size="small">Mínimo de linhas por slide</Text>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={minLinesPerSlide}
                      onChange={(e) => {
                        const num = parseInt(e.target.value, 10);
                        if (!isNaN(num) && num > 0 && num <= 10) {
                          setMinLinesPerSlide(num);
                          // Garantir que min não seja maior que max
                          if (num > maxLinesPerSlide) {
                            setMaxLinesPerSlide(num);
                          }
                        }
                      }}
                      style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
                        width: "100%",
                      }}
                    />
                  </Rows>
                </Column>
                <Column width="1/2">
                  <Rows spacing="1u">
                    <Text size="small">Máximo de linhas por slide</Text>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={maxLinesPerSlide}
                      onChange={(e) => {
                        const num = parseInt(e.target.value, 10);
                        if (!isNaN(num) && num > 0 && num <= 10) {
                          setMaxLinesPerSlide(num);
                          // Garantir que max não seja menor que min
                          if (num < minLinesPerSlide) {
                            setMinLinesPerSlide(num);
                          }
                        }
                      }}
                      style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
                        width: "100%",
                      }}
                    />
                  </Rows>
                </Column>
              </Columns>
              <Text tone="tertiary" size="small">
                Configure quantas linhas de letra aparecerão em cada slide. O
                número mínimo garante que cada slide tenha pelo menos essa
                quantidade de linhas, e o máximo limita o número de linhas por
                slide para evitar que o conteúdo seja cortado.
              </Text>
            </Rows>
          </Rows>
        )}

        {!isLoadingSongs && (
          <SongBrowser
            songs={songs}
            onSelectSong={handleSongSelect}
            isLoading={isLoading || !isAddPageSupported}
          />
        )}
      </Rows>
    </div>
  );
};
