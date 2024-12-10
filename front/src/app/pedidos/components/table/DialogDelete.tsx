import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { deleteOrder } from "../../data/queries";
import { useMutation } from "@tanstack/react-query";
import { Order, useOrderStore } from "@/app/stores/orderStore";

export function DialogDelete({
  order,
  hideDialog,
}: {
  order: Order;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const removeSale = useOrderStore((state) => state.removeOrderInList);

  const { mutate: deleteOrderFn } = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess() {
      hideDialog();
      removeSale(order.id);
      toast({
        title: "Cliente deletado com sucesso",
        description:
          "Cliente foi deletado com sucesso na base de dados do sistema!",
        style: { backgroundColor: "green", color: "white" },
      });
    },
    onError(err: any) {
      toast({
        title: "Erro ao deletar cliente!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Deletar Pedido</DialogTitle>
        <DialogDescription>
          Tem certeza que deseja deletar esse registro do sistema? Essa ação não
          pode ser desfeita!
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button
          variant="destructive"
          onClick={() => {
            deleteOrderFn(order.id);
          }}
        >
          Deletar
        </Button>
      </DialogFooter>
    </>
  );
}
