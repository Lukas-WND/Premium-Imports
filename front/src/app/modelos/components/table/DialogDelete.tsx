import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { deleteModel } from "../../data/queries";
import { queryClient } from "@/lib/react-query";
import { useToast } from "@/hooks/use-toast";

export default function DialogDelete({
  serviceId,
  setShowDialog,
}: {
  serviceId: string;
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
      //   toast.success('Permissão excluída com sucesso!')
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
        <DialogTitle>Deletar Permissão</DialogTitle>
        <DialogDescription>
          Tem certeza que quer deletar esse registro do sistema? Essa ação não
          pode ser desfeita!
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button onClick={() => handleDeleteService(serviceId)}>Deletar</Button>
      </DialogFooter>
    </>
  );
}
