import { api } from "@/api/api";
import { Automaker } from "@/app/stores/automakerStore";

const route: string = "/automaker";

// Obtém todos os modelos
export async function getAutomakers(): Promise<Automaker[] | null> {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error("Erro ao obter os clientes:", error);
    return []; // Retorna `null` em caso de erro
  }
}

// Cria um novo modelo
export async function createAutomaker(
  model: Omit<Automaker, "id">
): Promise<Automaker> {
  const { data } = await api.post(route, model);

  if (data) {
    return data;
  }

  throw new Error("Erro ao criar cliente");
}

// Atualiza um modelo existente
export async function updateAutomaker(
  modelId: string,
  updates: Partial<Omit<Automaker, "id">>
): Promise<Automaker> {
  const { data } = await api.patch(`${route}/${modelId}`, updates);

  if (data) {
    return data;
  }

  throw new Error("Erro ao atualizar cliente!");
}

// Deleta um modelo existente
export async function deleteAutomaker(modelId: string): Promise<boolean> {
  const { data } = await api.delete(`${route}/${modelId}`);

  if (data) {
    return data;
  }

  throw new Error("Erro ao deletar cliente do sistema!");
}
