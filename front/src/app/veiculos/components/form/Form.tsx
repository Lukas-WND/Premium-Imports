import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createVehicle, updateVehicle } from "../../data/queries";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import {
  ToCreateOrUpdateVehicle,
  useVehicleStore,
  Vehicle,
} from "@/app/stores/vehicleStore";
import { Model, useModelStore } from "@/app/stores/modelStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModels } from "@/app/modelos/data/queries";
import { useEffect, useState } from "react";

export function CreateVehicleForm({
  data,
  hideDialog,
}: {
  data?: Vehicle;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const addVehicle = useVehicleStore((state) => state.addVehicleInList);
  const models: Model[] = useModelStore((state) => state.modelList);
  const setModels = useModelStore((state) => state.setModelList);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (models.length === 0) {
      queryClient
        .fetchQuery({
          queryKey: ["models"],
          queryFn: getModels,
        })
        .then((res) => setModels(res || []))
        .catch((err) => {
          toast({
            title: "Erro ao carregar modelos",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  }, [models.length, setModels, toast, open]);

  const vehicleSchema = z
    .object({
      vehicleId: z.string().optional(),
      modelId: z.string().optional(),
      modelName: z.string().optional(),
      modelYear: z.coerce.number().optional(),
      chassisNumber: z.string().min(1, "Informe o número do chassi"),
      plate: z.string().min(1, "Informe a placa do veículo"),
      fabricatingYear: z.coerce.number().min(1, "Informe o ano de fabricação"),
      color: z.string().min(1, "Informe a cor do veículo"),
      price: z.coerce.number().min(1, "Informe o preço do veículo"),
    })
    .refine((data) => data.modelId == "no_model" || (data.modelName && data.modelYear), {
      message:
        "Informe os dados do modelo caso o ModelId não esteja preenchido.",
      path: ["modelName", "modelYear"],
    });

  const newVehicle = useMutation({
    mutationFn: createVehicle,
    onSuccess: (createdVehicle: Vehicle) => {
      addVehicle(createdVehicle);
      toast({
        title: "Veículo Criado com sucesso!",
        description:
          "Novo veículo foi registrado com sucesso na base de dados do sistema!",
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao criar novo veículo!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const uptVehicle = useMutation({
    mutationFn: (vehicle: Partial<ToCreateOrUpdateVehicle>) =>
      updateVehicle(data?.vehicleId || "", vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      hideDialog();
      toast({
        title: "Veículo atualizado com sucesso!",
        description: `O veículo de modelo ${data?.modelId?.modelName} ${data?.modelId?.modelYear} foi atualizado com sucesso na base de dados do sistema!`,
        style: { backgroundColor: "green", color: "white" },
      });
    },
    onError: (err) => {
      toast({
        title: "Erro ao atualizar o veículo!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateModel: SubmitHandler<z.infer<typeof vehicleSchema>> = (
    vehicle
  ) => {
    if(vehicle.modelId === "no_model") {
      delete vehicle.modelId
    }
    newVehicle.mutate(vehicle);
  };

  const handleUpdateModel: SubmitHandler<z.infer<typeof vehicleSchema>> = (
    vehicle
  ) => {
    if(vehicle.modelId === "no_model") {
      delete vehicle.modelId
    }
    uptVehicle.mutate(vehicle);
  };

  
  const {
    setValue,
    register,
    handleSubmit,
    control,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      modelId: data?.modelId.modelId,
      modelName: data?.modelId?.modelName,
      modelYear: data?.modelId?.modelYear,
      chassisNumber: data?.chassisNumber,
      color: data?.color,
      fabricatingYear: data?.fabricatingYear,
      plate: data?.plate,
      price: data?.price,
    },
  });
  
  const { field } = useController({
    name: "modelId",
    control: control,
  });
  
  const selectedModel = models.find((e) => e.modelId == field.value);
  
  console.log(field.value);
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(data ? handleUpdateModel : handleCreateModel)}
    >
      <div className="flex flex-col gap-4 mt-2">
        <Label>
          <p>Modelo</p>
          <Popover open={open} onOpenChange={(open) => setOpen(open)}>
            <PopoverTrigger asChild>
              <Button
                className="w-full mt-2"
                variant="outline"
                role="combobox"
                onClick={() => setOpen(true)}
              >
                {selectedModel
                  ? `${selectedModel.modelName} ${selectedModel.modelYear}`
                  : field.value === "no_model"
                  ? "NOVO MODELO"
                  : "Selecione o Modelo"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <Command className="w-full">
                <CommandInput
                  placeholder="Pesquise o nome do modelo..."
                  className="w-full"
                />
                <CommandList className="w-full">
                  <CommandEmpty>Modelo não encontrado.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key={"no_model"}
                      value={"no_model"}
                      onSelect={() => {
                        setOpen(false);
                        setValue("modelId", "no_model");
                      }}
                    >
                      NOVO MODELO
                    </CommandItem>
                    {models.map((item, idx) => (
                      <CommandItem
                        key={idx}
                        value={item.modelName}
                        onSelect={() => {
                          setOpen(false);
                          setValue("modelId", item.modelId);
                        }}
                      >
                        {item.modelName} {item.modelYear}
                        <Check
                          className={cn(
                            "ml-auto",
                            item.modelId === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </Label>

        {field.value === "no_model" && (
          <div className="flex gap-4 w-full">
            <Label className="w-1/2">
              <p>Nome do Modelo</p>
              <Input
                placeholder="Nome do Modelo..."
                {...register("modelName")}
              />
              {errors.modelName && (
                <p className="text-red-500">{errors.modelName.message}</p>
              )}
            </Label>
            <Label className="w-1/2">
              <p>Ano do Modelo</p>
              <Input
                placeholder="Ano do Modelo..."
                {...register("modelYear")}
              />
              {errors.modelYear && (
                <p className="text-red-500">{errors.modelYear.message}</p>
              )}
            </Label>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Label className="w-2/3">
            <p>Número do Chassi</p>
            <Input
              className="mt-2"
              placeholder="Chassi..."
              {...register("chassisNumber")}
            />
            {errors.chassisNumber && (
              <p className="text-red-500">{errors.chassisNumber.message}</p>
            )}
          </Label>

          <Label>
            <p>Ano de Fabricação</p>
            <Input
              className="mt-2"
              placeholder="Ano de Fabricação..."
              {...register("fabricatingYear")}
            />
            {errors.fabricatingYear && (
              <p className="text-red-500">{errors.fabricatingYear.message}</p>
            )}
          </Label>
        </div>

        <Label>
          <p>Placa</p>
          <Input
            className="mt-2"
            placeholder="Placa..."
            {...register("plate")}
          />
          {errors.plate && (
            <p className="text-red-500">{errors.plate.message}</p>
          )}
        </Label>

        <Label>
          <p>Cor</p>
          <Input className="mt-2" placeholder="Cor..." {...register("color")} />
          {errors.color && (
            <p className="text-red-500">{errors.color.message}</p>
          )}
        </Label>

        <Label>
          <p>Preço</p>
          <Input
            className="mt-2"
            placeholder="R$ XXXX..."
            {...register("price")}
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </Label>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button type="submit" disabled={isLoading}>
          Salvar
        </Button>
        <Button variant="outline" type="button" onClick={hideDialog}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
