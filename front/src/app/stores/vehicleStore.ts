import { create } from "zustand";
import { Model } from "./modelStore";

export type Vehicle = {
  vehicleId: string;
  chassisNumber: string;
  plate: string;
  fabricatingYear: number;
  color: string;
  price: number;
  modelId: Model;
};

export type ToCreateOrUpdateVehicle = {
  chassisNumber: string;
  plate: string;
  fabricatingYear: number;
  color: string;
  price: number;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
};

export type Actions = {
  setVehicleList: (vehicleList: Vehicle[]) => void;
  addVehicleInList: (vehicle: Vehicle) => void;
  removeVehicleInList: (vehicleId: string) => void;
};

type VehicleStore = {
  vehicleList: Vehicle[];
};

export const useVehicleStore = create<VehicleStore & Actions>((set) => ({
  vehicleList: [],

  // Substitui a lista inteira de veículos
  setVehicleList(vehicleList) {
    set(() => ({ vehicleList }));
  },

  // Adiciona um novo veículo na lista
  addVehicleInList(vehicle) {
    set((state) => ({
      vehicleList: [...state.vehicleList, vehicle],
    }));
  },

  // Remove um veículo da lista pelo ID
  removeVehicleInList(vehicleId) {
    set((state) => ({
      vehicleList: state.vehicleList.filter(
        (vehicle) => vehicle.vehicleId !== vehicleId
      ),
    }));
  },
}));
