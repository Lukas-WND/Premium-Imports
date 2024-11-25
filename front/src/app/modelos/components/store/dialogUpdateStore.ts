import { create } from "zustand";

type DialogUpdateStore = {
  show: boolean;
  showDialog: () => void;
  hideDialog: () => void;
};

export const useDialogUpdateStore = create<DialogUpdateStore>((set) => ({
  show: false,
  component: null,
  showDialog: () => {
    set({ show: true });
  },
  hideDialog: () => {
    set({ show: false });
  },
}));
