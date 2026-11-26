"use client";

import { useFormStatus } from "react-dom";

// Submit button that answers the moment a save starts: disabled, with its
// pending label blinking in the same cell (see .adm-btn in admin.css).
const SubmitButton = ({ children, pending: pendingLabel = "saving…", variant = "primary", size, block, ...rest }) => {
  const { pending } = useFormStatus();
  const cls = ["adm-btn", `adm-btn-${variant}`, size && `adm-btn-${size}`, block && "adm-btn-block"]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      data-pending={pending || undefined}
      className={cls}
      {...rest}
    >
      <span className="adm-btn-idle">{children}</span>
      <span className="adm-btn-pending" aria-hidden={!pending}>
        {pendingLabel}
      </span>
    </button>
  );
};

export default SubmitButton;
