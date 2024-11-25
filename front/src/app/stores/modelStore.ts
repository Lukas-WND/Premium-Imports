import { create } from "zustand";

export type Model = {
  modelId: string;
  modelName: string;
  modelYear: number;
};

export type Actions = {
  setSelectedModel: (modelId: string) => void;
  setModelList: (modelList: Model[]) => void;
  addModelInList: (model: Model) => void;
  removeModelInList: (modelId: string) => void;
};

type ModelStore = {
  modelList: Model[];
  selectedModel?: Model;
};

export const useModelStore = create<ModelStore & Actions>((set) => ({
  modelList: [],
  selectedModel: undefined,

  // Substitui a lista inteira de modelos
  setModelList(modelList) {
    set(() => ({ modelList }));
  },

  // Define o modelo selecionado com base no ID
  setSelectedModel(modelId) {
    set((state) => ({
      selectedModel: state.modelList.find((model) => model.modelId === modelId),
    }));
  },

  // Adiciona um novo modelo na lista
  addModelInList(model) {
    set((state) => ({
      modelList: [...state.modelList, model],
    }));
  },

  // Remove um modelo da lista pelo ID
  removeModelInList(modelId) {
    set((state) => ({
      modelList: state.modelList.filter((model) => model.modelId !== modelId),
    }));
  },
}));
