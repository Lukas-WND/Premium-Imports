import { api } from "@/api/api";
import { Client } from "@/app/stores/clientStore";

const route: string = "/client";

// Obtém todos os modelos
export async function getClients(): Promise<Client[] | null> {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error("Erro ao obter os clientes:", error);
    return []; // Retorna `null` em caso de erro
  }
}

// Cria um novo modelo
export async function createClient(
  model: Omit<Client, "id">
): Promise<Client> {
  const { data } = await api.post(route, model);

  if (data) {
    return data;
  }

  throw new Error("Erro ao criar cliente");
}

// Atualiza um modelo existente
export async function updateClient(
  modelId: string,
  updates: Partial<Omit<Client, "id">>
): Promise<Client> {
  const { data } = await api.patch(`${route}/${modelId}`, updates);

  if (data) {
    return data;
  }

  throw new Error("Erro ao atualizar cliente!");
}

// Deleta um modelo existente
export async function deleteClient(modelId: string): Promise<boolean> {
  const { data } = await api.delete(`${route}/${modelId}`);

  if (data) {
    return data;
  }

  throw new Error("Erro ao deletar cliente do sistema!");
}
