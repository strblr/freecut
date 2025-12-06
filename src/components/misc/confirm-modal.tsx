import type { ReactNode } from "react";
import { create } from "zustand";
import { uniqueId, without } from "lodash-es";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type ButtonProps
} from "@/components";

interface ConfirmStore {
  dialogs: ConfirmDialog[];
  show: (options: ConfirmOptions) => Promise<boolean>;
  resolve: (id: string, value: boolean) => void;
}

interface ConfirmDialog {
  id: string;
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export interface ConfirmOptions {
  title?: ReactNode;
  message: ReactNode;
  confirmProps?: Partial<ButtonProps>;
  cancelProps?: Partial<ButtonProps>;
}

const useConfirmStore = create<ConfirmStore>((set, get) => ({
  dialogs: [],
  show: (options: ConfirmOptions) => {
    return new Promise<boolean>(resolve => {
      const dialog: ConfirmDialog = {
        id: uniqueId("confirm-"),
        options,
        resolve
      };
      set({ dialogs: [...get().dialogs, dialog] });
    });
  },
  resolve: (id: string, value: boolean) => {
    const { dialogs } = get();
    const dialog = dialogs.find(d => d.id === id);
    if (!dialog) return;
    dialog.resolve(value);
    set({ dialogs: without(dialogs, dialog) });
  }
}));

export const confirm = useConfirmStore.getState().show;

export function ConfirmModal() {
  const { dialogs, resolve } = useConfirmStore();
  const dialog = dialogs[0];
  if (!dialog) return null;

  const { title, message, confirmProps, cancelProps } = dialog.options;

  const handleConfirm = () => {
    resolve(dialog.id, true);
  };

  const handleDismiss = () => {
    resolve(dialog.id, false);
  };

  return (
    <Dialog open={true} onOpenChange={open => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{title ?? "Confirm"}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDismiss}
            children="Cancel"
            {...cancelProps}
          />
          <Button
            size="sm"
            onClick={handleConfirm}
            children="Confirm"
            {...confirmProps}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
