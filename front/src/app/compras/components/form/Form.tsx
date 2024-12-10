import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { usePurchaseStore } from "@/app/stores/purchaseStore";
import { createPurchase, updatePurchase } from "../../data/queries";
import {
  Purchase,
  PurchaseToCreate,
  PurchaseToUpdate,
} from "@/app/stores/purchaseStore";
import { useClientStore } from "@/app/stores/clientStore";
import { useSellerStore } from "@/app/stores/sellerStore";
import { useEffect, useState } from "react";
import { getClients } from "@/app/clientes/data/queries";
import { getSellers } from "@/app/vendedores/data/queries";
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
import { useModelStore } from "@/app/stores/modelStore";
import { getModels } from "@/app/modelos/data/queries";

export function CreatePurchaseForm({
  data,
  hideDialog,
}: {
  data?: Purchase;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const addPurchase = usePurchaseStore((state) => state.addPurchaseInList);

  const modelsList = useModelStore((state) => state.modelList);
  const setModelsList = useModelStore((state) => state.setModelList);

  const clientsList = useClientStore((state) => state.clientList);
  const setClientsList = useClientStore((state) => state.setClientList);

  const sellersList = useSellerStore((state) => state.sellerList);
  const setSellersList = useSellerStore((state) => state.setSellerList);

  const [openVehicles, setOpenVehicles] = useState(false);
  const [openClients, setOpenClients] = useState(false);
  const [openSellers, setOpenSellers] = useState(false);

  useEffect(() => {
    if (modelsList.length === 0) {
      queryClient
        .fetchQuery({
          queryKey: ["models"],
          queryFn: getModels,
        })
        .then((res) => setModelsList(res || []))
        .catch((err) => {
          toast({
            title: "Erro ao carregar veículos",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  }, [modelsList.length, setModelsList, toast, openVehicles]);

  useEffect(() => {
    if (clientsList.length === 0) {
      queryClient
        .fetchQuery({
          queryKey: ["clients"],
          queryFn: getClients,
        })
        .then((res) => setClientsList(res || []))
        .catch((err) => {
          toast({
            title: "Erro ao carregar clientes",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  }, [clientsList.length, setClientsList, toast, openClients]);

  useEffect(() => {
    if (sellersList.length === 0) {
      queryClient
        .fetchQuery({
          queryKey: ["sellers"],
          queryFn: getSellers,
        })
        .then((res) => setSellersList(res || []))
        .catch((err) => {
          toast({
            title: "Erro ao carregar vendedores",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  }, [sellersList.length, setSellersList, toast, openSellers]);

  const purchaseSchema = z.object({
    id: z.string().optional(),
    purchaseValue: z.coerce.number().min(1, "O valor da compra é obrigatório"),
    vehicle: z.string().optional(),
    client: z.string().min(1, "O cliente é obrigatório"),
    seller: z.string().min(1, "O vendedor é obrigatório"),
    modelId: z.string().optional(),
    modelName: z.string().optional(),
    modelYear: z.coerce.number().optional(),
    color: z.string().min(1, "A cor do veículo é obrigatória"),
    chassisNumber: z.string().min(1, "O número do chassi é obrigatório"),
    plate: z.string().min(1, "A placa é obrigatória"),
  });

  const newPurchase = useMutation({
    mutationFn: createPurchase,
    onSuccess: (createdPurchase: Purchase) => {
      queryClient.invalidateQueries({ queryKey: ["purchases", "vehicles"] });
      addPurchase(createdPurchase);
      toast({
        title: "Compra registrada com sucesso!",
        description: "A nova compra foi adicionada à base de dados do sistema.",
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao registrar compra!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const uptPurchase = useMutation({
    mutationFn: (purchase: PurchaseToUpdate) =>
      updatePurchase(purchase.id, purchase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases", "vehicles"] });
      toast({
        title: "Compra atualizada com sucesso!",
        description: `A compra foi atualizada na base de dados.`,
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao atualizar compra!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreatePurchase: SubmitHandler<z.infer<typeof purchaseSchema>> = (
    purchase
  ) => {
    if (purchase.modelId == "no_model") {
      delete purchase.modelId;
    }
    newPurchase.mutate(purchase as PurchaseToCreate);
  };

  const handleUpdatePurchase: SubmitHandler<z.infer<typeof purchaseSchema>> = (
    purchase
  ) => {
    uptPurchase.mutate(purchase as PurchaseToUpdate);
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      id: data?.id,
      purchaseValue: data?.purchaseValue,
      vehicle: data?.vehicle.vehicleId,
      client: data?.client.id,
      seller: data?.seller.id,
      modelId: data?.vehicle?.modelId.modelId,
    },
  });

  const { field: fieldClient } = useController({ name: "client", control });
  const { field: fieldModel } = useController({ name: "modelId", control });
  const { field: fieldSeller } = useController({ name: "seller", control });

  const selectedClient = clientsList.find((e) => e.id === fieldClient.value);
  const selectedModel = modelsList.find((e) => e.modelId === fieldModel.value);
  const selectedSeller = sellersList.find((e) => e.id === fieldSeller.value);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(
        data ? handleUpdatePurchase : handleCreatePurchase
      )}
    >
      {data && (
        <Label>
          <p>Código da Compra</p>
          <Input
            className="mt-2"
            placeholder="Código"
            disabled
            value={data?.purchaseCode}
          />
        </Label>
      )}

      {data && (
        <Label>
          <p>Veículo</p>
          <Input
            className="mt-2"
            placeholder="veículo..."
            value={`${data.vehicle.modelId.modelName} - ${data.vehicle.modelId.modelYear}`}
            disabled
            {...register("vehicle")}
          />
        </Label>
      )}

      <Label>
        <p>Cliente</p>
        <Popover
          open={openClients}
          onOpenChange={(open) => setOpenClients(open)}
        >
          <PopoverTrigger asChild>
            <Button
              className="w-full mt-2"
              variant="outline"
              role="combobox"
              onClick={() => setOpenClients(true)}
            >
              {selectedClient ? selectedClient.name : "Selecione o Cliente"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <Command className="w-full">
              <CommandInput
                placeholder="Pesquise o nome do cliente..."
                className="w-full"
              />
              <CommandList className="w-full">
                <CommandEmpty>Cliente não encontrado.</CommandEmpty>
                <CommandGroup>
                  {clientsList.map((client, idx) => (
                    <CommandItem
                      key={idx}
                      value={client.name}
                      onSelect={() => {
                        setOpenClients(false);
                        setValue("client", client.id);
                      }}
                    >
                      {client.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          client.id === fieldClient.value
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
        {errors.client && (
          <p className="mt-1 text-red-500 text-end">{errors.client.message}</p>
        )}
      </Label>

      <Label>
        <p>Vendedor</p>
        <Popover
          open={openSellers}
          onOpenChange={(open) => setOpenSellers(open)}
        >
          <PopoverTrigger asChild>
            <Button
              className="w-full mt-2"
              variant="outline"
              role="combobox"
              onClick={() => setOpenSellers(true)}
            >
              {selectedSeller ? selectedSeller.name : "Selecione o Vendedor"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <Command className="w-full">
              <CommandInput
                placeholder="Pesquise o nome do vendedor..."
                className="w-full"
              />
              <CommandList className="w-full">
                <CommandEmpty>Vendedor não encontrado.</CommandEmpty>
                <CommandGroup>
                  {sellersList.map((seller, idx) => (
                    <CommandItem
                      key={idx}
                      value={seller.name}
                      onSelect={() => {
                        setOpenSellers(false);
                        setValue("seller", seller.id);
                      }}
                    >
                      {seller.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          seller.id === fieldSeller.value
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
        {errors.seller && (
          <p className="mt-1 text-red-500 text-end">{errors.seller.message}</p>
        )}
      </Label>

      <Label>
        <p>Modelo</p>
        <Popover
          open={openVehicles}
          onOpenChange={(open) => setOpenVehicles(open)}
        >
          <PopoverTrigger asChild>
            <Button
              className="w-full mt-2"
              variant="outline"
              role="combobox"
              onClick={() => setOpenVehicles(true)}
            >
              {selectedModel
                ? `${selectedModel.modelName} ${selectedModel.modelYear}`
                : fieldModel.value === "no_model"
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
                      setOpenVehicles(false);
                      setValue("modelId", "no_model");
                    }}
                  >
                    NOVO MODELO
                  </CommandItem>
                  {modelsList.map((item, idx) => (
                    <CommandItem
                      key={idx}
                      value={item.modelName}
                      onSelect={() => {
                        setOpenVehicles(false);
                        setValue("modelId", item.modelId);
                      }}
                    >
                      {item.modelName} {item.modelYear}
                      <Check
                        className={cn(
                          "ml-auto",
                          item.modelId === fieldModel.value
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
        {errors.modelId && (
          <p className="mt-1 text-red-500 text-end">{errors.modelId.message}</p>
        )}
      </Label>

      {fieldModel.value == "no_model" && (
        <div className="flex gap-4 w-full">
          <Label className="w-1/2">
            <p>Nome do Modelo</p>
            <Input
              className="mt-2"
              placeholder="Nome do modelo..."
              {...register("modelName")}
            />
            {errors.modelName && (
              <p className="text-red-500">{errors.modelName.message}</p>
            )}
          </Label>
          <Label className="w-1/2">
            <p>Ano do modelo</p>
            <Input
              className="mt-2"
              placeholder="Ano do modelo..."
              {...register("modelYear")}
            />
            {errors.modelYear && (
              <p className="text-red-500">{errors.modelYear.message}</p>
            )}
          </Label>
        </div>
      )}

      <Label>
        <p>Número do Chassi</p>
        <Input
          className="mt-2"
          placeholder="Num. do Chassi..."
          {...register("chassisNumber")}
        />
        {errors.chassisNumber && (
          <p className="text-red-500">{errors.chassisNumber.message}</p>
        )}
      </Label>
      <div className="flex gap-4 w-full">
        <Label className="w-1/2">
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

        <Label className="w-1/2">
          <p>Cor</p>
          <Input
            className="mt-2"
            placeholder="Num. do Chassi..."
            {...register("color")}
          />
          {errors.color && (
            <p className="text-red-500">{errors.color.message}</p>
          )}
        </Label>
      </div>

      <Label>
        <p>Valor do veículo</p>
        <Input
          className="mt-2"
          placeholder="Valor da compra"
          {...register("purchaseValue")}
        />
        {errors.purchaseValue && (
          <p className="mt-1 text-red-500 text-end">
            {errors.purchaseValue.message}
          </p>
        )}
      </Label>

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button type="submit" disabled={isSubmitting}>
          Salvar
        </Button>
        <Button variant="outline" type="button" onClick={hideDialog}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
