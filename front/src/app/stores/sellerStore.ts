import { create } from "zustand";

export type Seller = {
  id: string;
  registration: string;
  name: string;
};

export type Actions = {
  setSellerList: (sellerList: Seller[]) => void;
  addSellerInList: (seller: Seller) => void;
  removeSellerInList: (sellerId: string) => void;
};

type SellerStore = {
  sellerList: Seller[];
};

export const useSellerStore = create<SellerStore & Actions>((set) => ({
  sellerList: [],

  // Substitui a lista inteira de selleros
  setSellerList(sellerList) {
    set(() => ({ sellerList }));
  },

  // Adiciona um novo sellero na lista
  addSellerInList(seller) {
    set((state) => ({
      sellerList: [...state.sellerList, seller],
    }));
  },

  // Remove um sellero da lista pelo ID
  removeSellerInList(sellerId) {
    set((state) => ({
      sellerList: state.sellerList.filter((seller) => seller.id !== sellerId),
    }));
  },
}));
