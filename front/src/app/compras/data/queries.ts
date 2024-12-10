import { api } from "@/api/api";
import {
  Purchase,
  PurchaseToCreate,
  PurchaseToUpdate,
} from "@/app/stores/purchaseStore";

const route: string = "/purchase";

// Obtém todos os modelos
export async function getPurchases(): Promise<Purchase[] | null> {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error("Erro ao obter registros: ", error);
    return [];
  }
}

// Cria um novo modelo
export async function createPurchase(
  model: PurchaseToCreate
): Promise<Purchase> {
  const { data } = await api.post(route, model);

  if (data) {
    return data;
  }

  throw new Error("Erro ao criar registro de compra");
}

// Atualiza um modelo existente
export async function updatePurchase(
  modelId: string,
  updates: PurchaseToUpdate
): Promise<Purchase> {
  const { data } = await api.patch(`${route}/${modelId}`, updates);

  if (data) {
    return data;
  }

  throw new Error("Erro ao atualizar registro de compra!");
}

// Deleta um modelo existente
export async function deletePurchase(modelId: string): Promise<boolean> {
  const { data } = await api.delete(`${route}/${modelId}`);

  if (data) {
    return data;
  }

  throw new Error("Erro ao deletar registro de compra do sistema!");
}
