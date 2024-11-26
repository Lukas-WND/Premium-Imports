import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { deleteSeller } from "../../data/queries";
import { useMutation } from "@tanstack/react-query";
import { Seller, useSellerStore } from "@/app/stores/sellerStore";

export function DialogDelete({
  seller,
  hideDialog,
}: {
  seller: Seller;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const removeClient = useSellerStore((state) => state.removeSellerInList);

  const { mutate: deleteSellerFn } = useMutation({
    mutationFn: (id: string) => deleteSeller(id),
    onSuccess() {
      hideDialog();
      removeClient(seller.id);
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
        <DialogTitle>Deletar Cliente</DialogTitle>
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
            deleteSellerFn(seller.id);
          }}
        >
          Deletar
        </Button>
      </DialogFooter>
    </>
  );
}
