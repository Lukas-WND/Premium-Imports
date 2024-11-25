import { Model } from "@/app/stores/modelStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,  
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DialogDelete } from "./DialogDelete";
import { useDialogUpdateStore } from "../store/dialogUpdateStore";
import { useState } from "react";
import { CreateModelForm } from "../form/Form";

export function DropdownActions({ model }: { model: Model }) {
  const hideDialog = useDialogUpdateStore((state) => state.hideDialog);
  const [isUpdate, setIsUpdate] = useState(true);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="aspect-square p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal size={4} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setIsUpdate(true)}>
              <Pencil size={4} />
              <span>Editar</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setIsUpdate(false)}>
              <Trash2 size={4} />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        {isUpdate ? (
          <DialogHeader>
            <DialogTitle>Atualizar Modelo</DialogTitle>
            <DialogDescription>
              Edite as informações abaixo e clique em salvar para atualizar as
              informações do registro.
            </DialogDescription>
            <div>
              <CreateModelForm data={model} hideDialog={hideDialog} />
            </div>
          </DialogHeader>
        ) : (
          <DialogDelete model={model} hideDialog={hideDialog} />
        )}
      </DialogContent>
    </Dialog>
  );
}
