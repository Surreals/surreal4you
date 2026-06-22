"use client";

import { deleteProduct } from "./actions";

const DeleteButton = ({ id, name }) => (
  <form
    action={deleteProduct}
    onSubmit={(e) => {
      if (!confirm(`Delete "${name}"? This cannot be undone.`)) e.preventDefault();
    }}
  >
    <input type="hidden" name="id" value={id} />
    <button
      type="submit"
      className="border-2 border-black px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-white"
    >
      Delete
    </button>
  </form>
);

export default DeleteButton;
