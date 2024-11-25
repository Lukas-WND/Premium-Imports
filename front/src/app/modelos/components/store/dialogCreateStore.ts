import React from "react";
import { create } from "zustand";

type DialogCreateStore = {
  show: boolean;
  showDialog: () => void;
  hideDialog: () => void;
};

export const useDialogCreateStore = create<DialogCreateStore>((set) => ({
  show: false,
  showDialog: () => {
    set({ show: true });
  },
  hideDialog: () => {
    set({ show: false });
  },
}));
