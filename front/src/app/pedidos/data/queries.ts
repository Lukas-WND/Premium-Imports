import { api } from "@/api/api";
import { CreateOrderDto, Order, UpdateOrderDto } from "@/app/stores/orderStore";

const route: string = "/order";

// Obtém todos os modelos
export async function getOrders(): Promise<Order[] | null> {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error("Erro ao obter os pedidos:", error);
    return [];
  }
}

// Cria um novo modelo
export async function createOrder(model: CreateOrderDto): Promise<Order> {
  const { data } = await api.post(route, model);

  if (data) {
    return data;
  }

  throw new Error("Erro ao criar cliente");
}

// Atualiza um modelo existente
export async function updateOrder(
  modelId: string,
  updates: UpdateOrderDto
): Promise<Order> {
  const { data } = await api.patch(`${route}/${modelId}`, updates);

  if (data) {
    return data;
  }

  throw new Error("Erro ao atualizar cliente!");
}

// Deleta um modelo existente
export async function deleteOrder(modelId: string): Promise<boolean> {
  const { data } = await api.delete(`${route}/${modelId}`);

  if (data) {
    return data;
  }

  throw new Error("Erro ao deletar cliente do sistema!");
}
