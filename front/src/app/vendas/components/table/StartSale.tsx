import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSaleForm } from "../form/Form";
import { useDialogCreateStore } from "../store/dialogCreateStore";
import { Plus } from "lucide-react";

export function StartSale() {
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
          Iniciar Venda
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo registro de venda
            ao sistema.
          </DialogDescription>
        </DialogHeader>
        <div>
          <CreateSaleForm hideDialog={hideDialog} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
