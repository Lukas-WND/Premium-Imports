import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { deleteVehicle } from "../../data/queries";
import { useMutation } from "@tanstack/react-query";
import { useVehicleStore, Vehicle } from "@/app/stores/vehicleStore";

export function DialogDelete({
  vehicle,
  hideDialog,
}: {
  vehicle: Vehicle;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const removeVehicle = useVehicleStore((state) => state.removeVehicleInList);

  const { mutate: deleteVehicleFn } = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess() {
      hideDialog();
      removeVehicle(vehicle.vehicleId);
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
        <DialogTitle>Deletar Veículo</DialogTitle>
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
            deleteVehicleFn(vehicle.vehicleId);
          }}
        >
          Deletar
        </Button>
      </DialogFooter>
    </>
  );
}
