"use client";

import { useEffect, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { deleteProduct } from "./actions";
import ActionForm from "../../_components/ActionForm";
import SubmitButton from "../../_components/SubmitButton";

// The dialog stays open while the delete runs and closes once it lands, so the
// form is never unmounted mid-submit. Cancel gets focus first (Radix default).
const DeleteButton = ({ id, name }) => {
  const [open, setOpen] = useState(false);
  // Portal into the admin root so the .adm-scoped styles reach the dialog,
  // for the exit animation too.
  const [container, setContainer] = useState(null);
  useEffect(() => setContainer(document.querySelector(".adm")), []);

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger className="adm-btn adm-btn-danger adm-btn-sm">delete</AlertDialog.Trigger>
      <AlertDialog.Portal container={container}>
        <AlertDialog.Overlay className="adm-overlay" />
        <AlertDialog.Content className="adm-dialog">
          <AlertDialog.Title className="adm-dialog-title">delete “{name}”?</AlertDialog.Title>
          <AlertDialog.Description className="adm-dialog-text">
            It disappears from the store right away. This cannot be undone.
          </AlertDialog.Description>
          <ActionForm
            action={deleteProduct}
            success="product deleted"
            error="could not delete. try again."
            onDone={() => setOpen(false)}
            className="adm-dialog-actions"
          >
            <input type="hidden" name="id" value={id} />
            <AlertDialog.Cancel className="adm-btn adm-btn-ghost">cancel</AlertDialog.Cancel>
            <SubmitButton variant="danger-solid" pending="deleting…">
              delete
            </SubmitButton>
          </ActionForm>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default DeleteButton;
