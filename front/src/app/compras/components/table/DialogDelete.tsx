import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { deletePurchase } from "../../data/queries";
import { useMutation } from "@tanstack/react-query";
import { Purchase, usePurchaseStore } from "@/app/stores/purchaseStore";

export function DialogDelete({
  purchase,
  hideDialog,
}: {
  purchase: Purchase;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const removePurchase = usePurchaseStore(
    (state) => state.removePurchaseInList
  );

  const { mutate: deletePurchaseFn } = useMutation({
    mutationFn: (id: string) => deletePurchase(id),
    onSuccess() {
      hideDialog();
      removePurchase(purchase.id);
      toast({
        title: "Compra deletada com sucesso",
        description:
          "Compra foi deletada com sucesso na base de dados do sistema!",
        style: { backgroundColor: "green", color: "white" },
      });
    },
    onError(err: any) {
      toast({
        title: "Erro ao deletar compra!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Deletar Registro de Compra</DialogTitle>
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
            deletePurchaseFn(purchase.id);
          }}
        >
          Deletar
        </Button>
      </DialogFooter>
    </>
  );
}
