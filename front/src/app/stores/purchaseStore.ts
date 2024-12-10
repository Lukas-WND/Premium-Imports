import { create } from "zustand";
import { Client } from "./clientStore";
import { Seller } from "./sellerStore";
import { Vehicle } from "./vehicleStore";

export type Purchase = {
  id: string;
  purchaseCode: string;
  purchaseDate: Date;
  purchaseValue: number;
  client: Client;
  seller: Seller;
  vehicle: Vehicle;
  createdAt: Date;
};

export type PurchaseToCreate = {
  purchaseCode: string;
  purchaseDate: Date;
  purchaseValue: number;
  client: string; 
  seller: string;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
  chassisNumber: string;
  color: string;
};

export type PurchaseToUpdate = {
  id: string;
  purchaseCode?: string;
  purchaseDate?: Date;
  purchaseValue?: number;
  client?: string;
  seller?: string;
};

export type Actions = {
  setPurchaseList: (purchaseList: Purchase[]) => void;
  addPurchaseInList: (purchase: Purchase) => void;
  removePurchaseInList: (purchaseId: string) => void;
};

type PurchaseStore = {
  purchaseList: Purchase[];
};

export const usePurchaseStore = create<PurchaseStore & Actions>((set) => ({
  purchaseList: [],

  // Substitui a lista inteira de purchases
  setPurchaseList(purchaseList) {
    set(() => ({ purchaseList }));
  },

  // Adiciona um novo purchase na lista
  addPurchaseInList(purchase) {
    set((state) => ({
      purchaseList: [...state.purchaseList, purchase],
    }));
  },

  // Remove um purchase da lista pelo ID
  removePurchaseInList(purchaseId) {
    set((state) => ({
      purchaseList: state.purchaseList.filter((purchase) => purchase.id !== purchaseId),
    }));
  },
}));
