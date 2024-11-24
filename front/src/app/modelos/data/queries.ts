import { api } from "@/api/api";
import { Model } from "../components/table/columns";

const route: string = "/model"

// Obtém todos os modelos
export async function getModels(): Promise<Model[] | null> {
    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const { data } = await api.get(route);
        return data;
    } catch (error) {
        console.error("Erro ao obter os modelos:", error);
        return null; // Retorna `null` em caso de erro
    }
}

// Cria um novo modelo
export async function createModel(model: Omit<Model, "modelId">): Promise<Model | null> {
    try {
        const { data } = await api.post(route, model);
        return data;
    } catch (error) {
        console.error("Erro ao criar o modelo:", error);
        return null;
    }
}

// Atualiza um modelo existente
export async function updateModel(
    modelId: string,
    updates: Partial<Omit<Model, "modelId">>
): Promise<Model | null> {
    try {
        const { data } = await api.put(`${route}/${modelId}`, updates);
        return data;
    } catch (error) {
        console.error(`Erro ao atualizar o modelo com ID ${modelId}:`, error);
        return null;
    }
}

// Deleta um modelo existente
export async function deleteModel(modelId: string): Promise<boolean> {
    try {
        await api.delete(`${route}/${modelId}`);
        return true; // Retorna true se a exclusão for bem-sucedida
    } catch (error) {
        console.error(`Erro ao deletar o modelo com ID ${modelId}:`, error);
        return false; // Retorna false em caso de erro
    }
}
