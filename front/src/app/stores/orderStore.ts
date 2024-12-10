import { create } from "zustand";
import { Client } from "./clientStore";
import { Seller } from "./sellerStore";
import { Automaker } from "./automakerStore";

export type Order = {
  id: string;
  orderCode: string;
  orderDate: Date;
  orderValue: number;
  client: Client;
  seller: Seller;
  automaker: Automaker;
  color: string;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
  status: number;
  createdAt: Date;
};

export type CreateOrderDto = {
  orderValue: number;
  client: string;
  seller: string;
  automaker: string;
  color: string;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
};

export type UpdateOrderDto = {
  id: string;
  orderValue?: number;
  client?: string;
  seller?: string;
  automaker?: string;
  color?: string;
};

export type OrderActions = {
  setOrderList: (orderList: Order[]) => void;
  addOrderInList: (order: Order) => void;
  removeOrderInList: (orderId: string) => void;
};

type OrderStore = {
  orderList: Order[];
};

export const useOrderStore = create<OrderStore & OrderActions>((set) => ({
  orderList: [],

  // Substitui a lista inteira de pedidos
  setOrderList(orderList) {
    set(() => ({ orderList }));
  },

  // Adiciona um novo pedido na lista
  addOrderInList(order) {
    set((state) => ({
      orderList: [...state.orderList, order],
    }));
  },

  // Remove um pedido da lista pelo ID
  removeOrderInList(orderId) {
    set((state) => ({
      orderList: state.orderList.filter((order) => order.id !== orderId),
    }));
  },
}));
