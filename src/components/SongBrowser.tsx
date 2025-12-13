import { Button, Rows, SearchInputMenu, Text } from "@canva/app-ui-kit";
import { useMemo, useState } from "react";
import type { Song } from "../utils/lyricsProcessor";
import * as styles from "styles/components.css";

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
  const hasValidArtist = (artist: string | null | undefined): boolean => {
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
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        (hasValidArtist(song.artist) &&
          song.artist!.toLowerCase().includes(query)),
    );
  }, [songs, searchQuery]);

  const handleSongSelect = (song: Song) => {
    if (!isLoading) {
      onSelectSong(song);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          Browse and select a song to add its lyrics as styled slides to your
          design.
        </Text>

        <SearchInputMenu
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search songs by title or artist..."
        />

        {filteredSongs.length === 0 ? (
          <Text tone="tertiary">
            {searchQuery.trim()
              ? "No songs found matching your search."
              : "No songs available."}
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
    </div>
  );
}
