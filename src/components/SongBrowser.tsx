/* eslint-disable formatjs/no-literal-string-in-jsx */
import { Button, Rows, SearchInputMenu, Text } from "@canva/app-ui-kit";
import { useMemo, useState } from "react";
import type { Song } from "../utils/lyricsProcessor";

interface SongBrowserProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  isLoading?: boolean;
}

export function SongBrowser({
  songs,
  onSelectSong,
  isLoading = false,
}: SongBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to check if artist is valid (not null, undefined, or empty)
  const hasValidArtist = (
    artist: string | null | undefined,
  ): artist is string => {
    return artist != null && artist.trim().length > 0;
  };

  // Helper function to format song display name
  const getSongDisplayName = (song: Song): string => {
    return hasValidArtist(song.artist)
      ? `${song.title} - ${song.artist}`
      : song.title;
  };

  // Filter songs based on search query
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) {
      return songs;
    }

    const query = searchQuery.toLowerCase().trim();
    return songs.filter((song) => {
      if (song.title.toLowerCase().includes(query)) {
        return true;
      }
      const artist = song.artist;
      if (hasValidArtist(artist)) {
        return artist.toLowerCase().includes(query);
      }
      return false;
    });
  }, [songs, searchQuery]);

  const handleSongSelect = (song: Song) => {
    if (!isLoading) {
      onSelectSong(song);
    }
  };

  return (
    <Rows spacing="3u">
      <SearchInputMenu
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar músicas por título ou artista..."
      />

      {filteredSongs.length === 0 ? (
        <Text tone="tertiary">
          {searchQuery.trim()
            ? "Nenhuma música encontrada correspondente à sua busca."
            : "Nenhuma música disponível."}
        </Text>
      ) : (
        <Rows spacing="2u">
          {filteredSongs.map((song) => (
            <Button
              key={song.id}
              variant="secondary"
              onClick={() => handleSongSelect(song)}
              disabled={isLoading}
              stretch
            >
              {getSongDisplayName(song)}
            </Button>
          ))}
        </Rows>
      )}
    </Rows>
  );
}
