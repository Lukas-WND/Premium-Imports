import React from "react";
import { create } from "zustand";

type DialogStore = {
  show: boolean;
  showDialog: () => void;
  hideDialog: () => void;
};

export const useDialogStore = create<DialogStore>((set) => ({
  show: false,
  showDialog: () => {
    set({ show: true });
  },
  hideDialog: () => {
    set({ show: false });
  },
}));
