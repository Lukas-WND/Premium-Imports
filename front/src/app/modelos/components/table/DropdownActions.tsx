import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
// import FormService from "./FormServices";
import { Model } from "./columns";
import DialogDelete from "./DialogDelete";
// import DialogDelete from "./DialogDelete";

export default function DropdownActions({ model }: { model: Model }) {
  const [dialogComponent, setDialogComponent] = useState(<></>);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger className="w-full">
            <DropdownMenuItem
              onClick={() => {
                setShowDialog(true);
                setDialogComponent(
                  // <FormService item={model} setShowDialog={setShowDialog} />
                  <div></div>
                );
              }}
            >
              <span>
                <Pencil className="size-4 mr-2" />
              </span>
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setShowDialog(true);
                setDialogComponent(
                  <DialogDelete
                    serviceId={model.modelId}
                    setShowDialog={setShowDialog}
                  />
                );
              }}
            >
              <span>
                <Trash2 className="size-4 mr-2" />
              </span>
              <span>Deletar</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {showDialog && <DialogContent>{dialogComponent}</DialogContent>}
    </Dialog>
  );
}
