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
  Button,
  NumberInput,
  ChevronDownIcon,
  ChevronUpIcon,
  Box,
  HelpCircleIcon,
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

// Componente auxiliar para tooltip de ajuda
const HelpTooltip = ({ tooltip }: { tooltip: string }) => (
  <Button
    variant="tertiary"
    icon={HelpCircleIcon}
    size="small"
    ariaLabel={tooltip}
    tooltipLabel={tooltip}
  />
);

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
  const [showSettings, setShowSettings] = useState<boolean>(false);
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
            <Button
              variant="tertiary"
              icon={showSettings ? ChevronUpIcon : ChevronDownIcon}
              iconPosition="end"
              onClick={() => setShowSettings(!showSettings)}
              stretch
            >
              Configurações
            </Button>

            {showSettings && (
              <Box
                background="neutralLow"
                border="low"
                borderRadius="standard"
                padding="3u"
              >
                <Rows spacing="3u">
                  <Rows spacing="2u">
                    <Columns spacing="1u" alignY="center">
                      <Column width="content">
                        <Title size="small">Cores</Title>
                      </Column>
                      <Column width="content">
                        <HelpTooltip tooltip="Escolha as cores de fundo e texto dos slides de letra" />
                      </Column>
                    </Columns>
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

                  <Rows spacing="2u">
                    <Columns spacing="1u" alignY="center">
                      <Column width="content">
                        <Title size="small">Linhas por slide</Title>
                      </Column>
                      <Column width="content">
                        <HelpTooltip tooltip="Configure quantas linhas de letra aparecerão em cada slide" />
                      </Column>
                    </Columns>
                    <Columns spacing="2u">
                      <Column width="1/2">
                        <Rows spacing="1u">
                          <Text size="small">Mínimo</Text>
                          <NumberInput
                            min={1}
                            max={10}
                            value={minLinesPerSlide}
                            onChange={(valueAsNumber) => {
                              if (
                                !isNaN(valueAsNumber) &&
                                valueAsNumber > 0 &&
                                valueAsNumber <= 10
                              ) {
                                setMinLinesPerSlide(valueAsNumber);
                                if (valueAsNumber > maxLinesPerSlide) {
                                  setMaxLinesPerSlide(valueAsNumber);
                                }
                              }
                            }}
                            hasSpinButtons
                            incrementAriaLabel="Aumentar mínimo"
                            decrementAriaLabel="Diminuir mínimo"
                          />
                        </Rows>
                      </Column>
                      <Column width="1/2">
                        <Rows spacing="1u">
                          <Text size="small">Máximo</Text>
                          <NumberInput
                            min={1}
                            max={10}
                            value={maxLinesPerSlide}
                            onChange={(valueAsNumber) => {
                              if (
                                !isNaN(valueAsNumber) &&
                                valueAsNumber > 0 &&
                                valueAsNumber <= 10
                              ) {
                                setMaxLinesPerSlide(valueAsNumber);
                                if (valueAsNumber < minLinesPerSlide) {
                                  setMinLinesPerSlide(valueAsNumber);
                                }
                              }
                            }}
                            hasSpinButtons
                            incrementAriaLabel="Aumentar máximo"
                            decrementAriaLabel="Diminuir máximo"
                          />
                        </Rows>
                      </Column>
                    </Columns>
                  </Rows>
                </Rows>
              </Box>
            )}
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
