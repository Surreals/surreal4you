import { SPOTIFY_ARTIST_ID } from "../../utils/constants";

const SpotifyEmbed = ({ id = SPOTIFY_ARTIST_ID, type = "artist", height = 352 }) => {
  return (
    <iframe
      title="Spotify player"
      src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`}
      width="100%"
      height={height}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      style={{ border: 0, borderRadius: 12, display: "block" }}
    />
  );
};

export default SpotifyEmbed;
