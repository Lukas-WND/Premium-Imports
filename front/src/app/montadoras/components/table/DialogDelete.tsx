import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { deleteAutomaker } from "../../data/queries";
import { useMutation } from "@tanstack/react-query";
import { Automaker, useAutomakerStore } from "@/app/stores/automakerStore";

export function DialogDelete({
  automaker,
  hideDialog,
}: {
  automaker: Automaker;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const removeAutomaker = useAutomakerStore(
    (state) => state.removeAutomakerInList
  );

  const { mutate: deleteAutomakerFn } = useMutation({
    mutationFn: (id: string) => deleteAutomaker(id),
    onSuccess() {
      hideDialog();
      removeAutomaker(automaker.id);
      toast({
        title: "Montadora deletado com sucesso",
        description:
          "Montadora foi deletado com sucesso na base de dados do sistema!",
        style: { backgroundColor: "green", color: "white" },
      });
    },
    onError(err: any) {
      toast({
        title: "Erro ao deletar Montadora!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Deletar Montadora</DialogTitle>
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
            deleteAutomakerFn(automaker.id);
          }}
        >
          Deletar
        </Button>
      </DialogFooter>
    </>
  );
}
