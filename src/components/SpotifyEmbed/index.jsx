import { SPOTIFY_ARTIST_ID } from "../../utils/constants";

// Sharp corners: the wells that hold this embed are hairline-bordered squares.
const frameStyle = { border: 0, display: "block" };

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
      style={frameStyle}
    />
  );
};

export default SpotifyEmbed;
