import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { deleteSale } from "../../data/queries";
import { useMutation } from "@tanstack/react-query";
import { Sale, useSaleStore } from "@/app/stores/saleStore";

export function DialogDelete({
  sale,
  hideDialog,
}: {
  sale: Sale;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const removeSale = useSaleStore((state) => state.removeSaleInList);

  const { mutate: deleteSaleFn } = useMutation({
    mutationFn: (id: string) => deleteSale(id),
    onSuccess() {
      hideDialog();
      removeSale(sale.id);
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
            deleteSaleFn(sale.id);
          }}
        >
          Deletar
        </Button>
      </DialogFooter>
    </>
  );
}
