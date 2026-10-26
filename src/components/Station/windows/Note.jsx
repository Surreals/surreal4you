// The artist's note. A text file left on the desk: title, date, paragraphs.
const Note = ({ note }) => {
  const paragraphs = (note.body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className="note p-5 sm:p-6">
      <div className="mb-5 flex items-baseline justify-between gap-4 text-dim">
        <span>{note.title}.txt</span>
        <span className="tnum">{note.date}</span>
      </div>
      {paragraphs.length ? (
        paragraphs.map((p, i) => (
          <p key={i} className="note-p">
            {p.split("\n").map((line, j) => (
              <span key={j}>
                {line}
                {j < p.split("\n").length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        ))
      ) : (
        <p className="note-p text-dim">nothing written yet.</p>
      )}
      <p className="mt-6 text-dim">— srrl</p>
    </div>
  );
};

export default Note;
