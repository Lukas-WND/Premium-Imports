import { create } from "zustand";

export type Automaker = {
  id: string;
  cnpj: string;
  corporateName: string;
  brand: string;
  email: string;
  businessPhone: string;
  cellPhone: string;
};

export type Actions = {
  setAutomakerList: (automakerList: Automaker[]) => void;
  addAutomakerInList: (automaker: Automaker) => void;
  removeAutomakerInList: (automakerId: string) => void;
};

type AutomakerStore = {
  automakerList: Automaker[];
};

export const useAutomakerStore = create<AutomakerStore & Actions>((set) => ({
  automakerList: [],

  // Substitui a lista inteira de automakeros
  setAutomakerList(automakerList) {
    set(() => ({ automakerList }));
  },

  // Adiciona um novo automakero na lista
  addAutomakerInList(automaker) {
    set((state) => ({
      automakerList: [...state.automakerList, automaker],
    }));
  },

  // Remove um automakero da lista pelo ID
  removeAutomakerInList(automakerId) {
    set((state) => ({
      automakerList: state.automakerList.filter(
        (automaker) => automaker.id !== automakerId
      ),
    }));
  },
}));
