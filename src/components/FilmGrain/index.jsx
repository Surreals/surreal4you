// Old-film stock over the whole page: grain that jumps frame to frame and a
// projector vignette that breathes. Pure CSS (see globals.css) so it stays a
// server component; motion is dropped under prefers-reduced-motion.
//
// Rendered per public page rather than from the root layout on purpose — it
// must not reach /admin, which is a plain black-on-white tool.
const FilmGrain = () => (
  <div className="film" aria-hidden="true">
    <span className="film-grain" />
    <span className="film-vignette" />
  </div>
);

export default FilmGrain;
