import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateClientForm } from "../form/Form";
import { useDialogCreateStore } from "../store/dialogCreateStore";
import { Plus } from "lucide-react";

export function CreateClient() {
  const show = useDialogCreateStore((state) => state.show);
  const showDialog = useDialogCreateStore((state) => state.showDialog);
  const hideDialog = useDialogCreateStore((state) => state.hideDialog);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          hideDialog();
        }
      }}
      open={show}
    >
      <DialogTrigger asChild>
        <Button onClick={() => showDialog()}>
          <Plus size={4} />
          Cadastrar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo registro de modelo
            ao sistema.
          </DialogDescription>
        </DialogHeader>
        <div>
          <CreateClientForm hideDialog={hideDialog}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
