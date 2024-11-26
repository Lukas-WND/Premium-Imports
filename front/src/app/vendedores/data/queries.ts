import { api } from "@/api/api";
import { Seller } from "@/app/stores/sellerStore";

const route: string = "/seller";

// Obtém todos os modelos
export async function getSellers(): Promise<Seller[] | null> {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error("Erro ao obter os vendedores:", error);
    return []; // Retorna `null` em caso de erro
  }
}

// Cria um novo modelo
export async function createSeller(model: Omit<Seller, "id">): Promise<Seller> {
  const { data } = await api.post(route, model);

  if (data) {
    return data;
  }

  throw new Error("Erro ao criar vendedor");
}

// Atualiza um modelo existente
export async function updateSeller(
  sellerId: string,
  updates: Partial<Omit<Seller, "id">>
): Promise<Seller> {
  const { data } = await api.patch(`${route}/${sellerId}`, updates);

  if (data) {
    return data;
  }

  throw new Error("Erro ao atualizar vendedor!");
}

// Deleta um modelo existente
export async function deleteSeller(sellerId: string): Promise<boolean> {
  const { data } = await api.delete(`${route}/${sellerId}`);

  if (data) {
    return data;
  }

  throw new Error("Erro ao deletar vendedor do sistema!");
}
