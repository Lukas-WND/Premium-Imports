import { api } from "@/api/api";
import { ToCreateOrUpdateVehicle, Vehicle } from "@/app/stores/vehicleStore";

const route: string = "/vehicle";

// Obtém todos os modelos
export async function getVehicles(): Promise<Vehicle[] | null> {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error("Erro ao obter os veículos:", error);
    return []; // Retorna `null` em caso de erro
  }
}

// Cria um novo modelo
export async function createVehicle(
  vehicle: ToCreateOrUpdateVehicle
): Promise<Vehicle> {
  const { data } = await api.post(route, vehicle);

  if (data) {
    return data;
  }

  throw new Error("Erro ao criar veículo");
}

// Atualiza um modelo existente
export async function updateVehicle(
  vehicleId: string,
  updates: Partial<ToCreateOrUpdateVehicle>
): Promise<Vehicle> {
  const { data } = await api.patch(`${route}/${vehicleId}`, updates);

  if (data) {
    return data;
  }

  throw new Error("Erro ao atualizar veículo!");
}

// Deleta um modelo existente
export async function deleteVehicle(vehicleId: string): Promise<boolean> {
  const { data } = await api.delete(`${route}/${vehicleId}`);

  if(data) {
    return data
  }

  throw new Error("Erro ao deletar veículo do sistema!")

}
