import { create } from "zustand";

type Component = "update" | "delete";

type DialogUpdateStore = {
  component: Component;
  show: boolean;
  showDialog: () => void;
  hideDialog: () => void;
  setComponent: (component: Component) => void;
};

export const useDialogUpdateStore = create<DialogUpdateStore>((set) => ({
  show: false,
  component: "update",
  showDialog: () => {
    set({ show: true });
  },
  hideDialog: () => {
    set({ show: false });
  },
  setComponent: (component) => {
    set({ component: component });
  },
}));
