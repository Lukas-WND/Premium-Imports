import { api } from "@/api/api";
import { Model } from "@/app/stores/modelStore";

const route: string = "/model";

// Obtém todos os modelos
export async function getModels(): Promise<Model[] | null> {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error("Erro ao obter os modelos:", error);
    return []; // Retorna `null` em caso de erro
  }
}

// Cria um novo modelo
export async function createModel(
  model: Omit<Model, "modelId">
): Promise<Model> {
  const { data } = await api.post(route, model);

  if (data) {
    return data;
  }

  throw new Error("Erro ao criar modelo");
}

// Atualiza um modelo existente
export async function updateModel(
  modelId: string,
  updates: Partial<Omit<Model, "modelId">>
): Promise<Model> {
  const { data } = await api.patch(`${route}/${modelId}`, updates);

  if (data) {
    return data;
  }

  throw new Error("Erro ao atualizar modelo!");
}

// Deleta um modelo existente
export async function deleteModel(modelId: string): Promise<boolean> {
  const { data } = await api.delete(`${route}/${modelId}`);

  if(data) {
    return data
  }

  throw new Error("Erro ao deletar modelo do sistema!")

}
