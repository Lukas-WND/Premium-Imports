import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { deleteModel } from "../../data/queries";
import { useMutation } from "@tanstack/react-query";
import { Model, useModelStore } from "@/app/stores/modelStore";

export function DialogDelete({
  model,
  hideDialog,
}: {
  model: Model;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const removeModel = useModelStore((state) => state.removeModelInList);

  const { mutate: deleteModelFn } = useMutation({
    mutationFn: (id: string) => deleteModel(id),
    onSuccess() {
      hideDialog();
      removeModel(model.modelId);
      toast({
        title: "Modelo deletado com sucesso",
        description:
          "Modelo foi deletado com sucesso na base de dados do sistema!",
        style: { backgroundColor: "green", color: "white" },
      });
    },
    onError(err: any) {
      toast({
        title: "Erro ao deletar modelo!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Deletar Modelo</DialogTitle>
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
            deleteModelFn(model.modelId);
          }}
        >
          Deletar
        </Button>
      </DialogFooter>
    </>
  );
}
