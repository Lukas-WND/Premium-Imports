import { api } from "@/api/api";
import { Sale, SaleToCreate, SaleToUpdate } from "@/app/stores/saleStore";

const route: string = "/sale";

// Obtém todos os modelos
export async function getSales(): Promise<Sale[] | null> {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error("Erro ao obter os clientes:", error);
    return []; 
  }
}

// Cria um novo modelo
export async function createSale(model: SaleToCreate): Promise<Sale> {
  const { data } = await api.post(route, model);

  if (data) {
    return data;
  }

  throw new Error("Erro ao criar cliente");
}

// Atualiza um modelo existente
export async function updateSale(
  modelId: string,
  updates: SaleToUpdate
): Promise<Sale> {
  const { data } = await api.patch(`${route}/${modelId}`, updates);

  if (data) {
    return data;
  }

  throw new Error("Erro ao atualizar cliente!");
}

// Deleta um modelo existente
export async function deleteSale(modelId: string): Promise<boolean> {
  const { data } = await api.delete(`${route}/${modelId}`);

  if (data) {
    return data;
  }

  throw new Error("Erro ao deletar cliente do sistema!");
}
