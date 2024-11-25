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
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export default function DialogDelete({
  modelId,
  setShowDialog,
}: {
  modelId: string;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  const { mutateAsync: deleteModelFn } = useMutation({
    mutationFn: deleteModel,
    onSuccess() {
      setShowDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
    onError() {
      //   toast.error('Erro ao excluir permissão')
    },
  });

  async function handleDeleteService(id: string) {
    try {
      await deleteModelFn(id);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Deletar Modelo</DialogTitle>
        <DialogDescription>
          Tem certeza que quer deletar esse registro do sistema? Essa ação não
          pode ser desfeita!
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button onClick={() => handleDeleteService(modelId)}>Deletar</Button>
      </DialogFooter>
    </>
  );
}
