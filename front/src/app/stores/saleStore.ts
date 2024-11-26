import { create } from "zustand";
import { Client } from "./clientStore";
import { Seller } from "./sellerStore";
import { Vehicle } from "./vehicleStore";

export type Sale = {
  id: string;
  saleCode: string;
  saleDate: Date;
  entryValue: number;
  financedAmount?: number;
  totalAmount: string;
  client: Client;
  seller: Seller;
  vehicle: Vehicle;
};

export type SaleToCreate = {
  entryValue: number;
  financedAmount?: number;
  totalAmount: string;
  client: string;
  seller: string;
  vehicle: string;
};

export type SaleToUpdate = {
  id: string;
  saleDate?: Date;
  entryValue?: number;
  financedAmount?: number;
  totalAmount?: string;
  client?: string;
  seller?: string;
  vehicle?: string;
};

export type Actions = {
  setSaleList: (saleList: Sale[]) => void;
  addSaleInList: (sale: Sale) => void;
  removeSaleInList: (saleId: string) => void;
};

type SaleStore = {
  saleList: Sale[];
};

export const useSaleStore = create<SaleStore & Actions>((set) => ({
  saleList: [],

  // Substitui a lista inteira de clientos
  setSaleList(saleList) {
    set(() => ({ saleList: saleList }));
  },

  // Adiciona um novo cliento na lista
  addSaleInList(sale) {
    set((state) => ({
      saleList: [...state.saleList, sale],
    }));
  },

  // Remove um cliento da lista pelo ID
  removeSaleInList(saleId) {
    set((state) => ({
      saleList: state.saleList.filter((sale) => sale.id !== saleId),
    }));
  },
}));
