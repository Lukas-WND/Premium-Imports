import { Model } from "@/app/stores/modelStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useState } from "react";
import { CreateModelForm } from "../form/Form";

export function DropdownActions({ model }: { model: Model }) {
  const [component, setComponent] = useState<"update" | "delete">("update");
  const [show, setShow] = useState(false);

  const hideDialog = () => {
    setShow(false);
  };

  const showDialog = () => {
    setShow(true);
  };

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
              setComponent("update");
            }}
          >
            <Pencil size={4} />
            <span>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setComponent("delete");
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
