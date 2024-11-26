import { create } from "zustand";

export type Client = {
  id: string;
  cpf: string;
  name: string;
  neighborhood: string;
  city: string;
  state: string;
  homePhone?: string;
  cellPhone: string;
  income: number;
};

export type Actions = {
  setClientList: (clientList: Client[]) => void;
  addClientInList: (client: Client) => void;
  removeClientInList: (clientId: string) => void;
};

type ClientStore = {
  clientList: Client[];
};

export const useClientStore = create<ClientStore & Actions>((set) => ({
  clientList: [],

  // Substitui a lista inteira de clientos
  setClientList(clientList) {
    set(() => ({ clientList }));
  },

  // Adiciona um novo cliento na lista
  addClientInList(client) {
    set((state) => ({
      clientList: [...state.clientList, client],
    }));
  },

  // Remove um cliento da lista pelo ID
  removeClientInList(clientId) {
    set((state) => ({
      clientList: state.clientList.filter(
        (client) => client.id !== clientId
      ),
    }));
  },
}));
