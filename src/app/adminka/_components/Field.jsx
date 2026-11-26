const Field = ({ label, children }) => (
  <label className="adm-field">
    <span className="adm-label">{label}</span>
    {children}
  </label>
);

export default Field;
