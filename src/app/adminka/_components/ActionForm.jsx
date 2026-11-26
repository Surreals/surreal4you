"use client";

import { useRef } from "react";
import { toast } from "sonner";

// A <form> around a server action that reports back with a toast. The action
// itself still re-checks admin rights (requireAdmin) on the server.
const ActionForm = ({ action, success, error = "could not save. try again.", reset, onDone, children, ...rest }) => {
  const ref = useRef(null);

  const run = async (formData) => {
    try {
      await action(formData);
    } catch {
      toast.error(error);
      return;
    }
    if (reset) ref.current?.reset();
    toast.success(success);
    onDone?.();
  };

  return (
    <form ref={ref} action={run} {...rest}>
      {children}
    </form>
  );
};

export default ActionForm;
