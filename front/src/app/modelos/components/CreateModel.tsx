import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateModelForm } from "./form/Form";

export function CreateModel() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Novo Modelo
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Novo Modelo
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo para adicionar um novo registro de modelo ao sistema.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <CreateModelForm />
                </div>
            </DialogContent>
        </Dialog>
    )
}