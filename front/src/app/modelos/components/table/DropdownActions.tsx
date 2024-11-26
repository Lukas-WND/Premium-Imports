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
import { useEffect, useState } from "react";
import { CreateModelForm } from "../form/Form";

export function DropdownActions({ model }: { model: Model }) {
  // const show = useDialogUpdateStore((state) => state.show);
  const component = useDialogUpdateStore((state) => state.component);
  // const hideDialog = useDialogUpdateStore((state) => state.hideDialog);
  // const showDialog = useDialogUpdateStore((state) => state.showDialog);
  const setComponet = useDialogUpdateStore((state) => state.setComponent);
  const [show, setShow] = useState(false);

  const hideDialog = () => {
    setShow(false);
  };

  const showDialog = () => {
    setShow(true);
  };

  // console.log(show);

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          hideDialog();
        }
      }}
    >
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
          <DropdownMenuItem
            onClick={() => {
              showDialog();
              setComponet("update");
            }}
          >
            <Pencil size={4} />
            <span>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setComponet("delete");
              showDialog();
            }}
          >
            <Trash2 size={4} />
            <span>Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        {component == "update" ? (
          <DialogHeader>
            <DialogTitle>Atualizar Modelo</DialogTitle>
            <DialogDescription>
              Edite as informações abaixo e clique em salvar para atualizar as
              informações do registro.
            </DialogDescription>
            <CreateModelForm data={model} hideDialog={hideDialog} />
          </DialogHeader>
        ) : (
          <DialogDelete model={model} hideDialog={hideDialog} />
        )}
      </DialogContent>
    </Dialog>
  );
}
