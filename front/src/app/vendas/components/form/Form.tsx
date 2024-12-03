import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { useSaleStore } from "@/app/stores/saleStore";
import { createSale, updateSale } from "../../data/queries";
import { Sale, SaleToCreate, SaleToUpdate } from "@/app/stores/saleStore";
import { useVehicleStore } from "@/app/stores/vehicleStore";
import { useClientStore } from "@/app/stores/clientStore";
import { useSellerStore } from "@/app/stores/sellerStore";
import { useEffect, useState } from "react";
import { getVehicles } from "@/app/veiculos/data/queries";
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

export function CreateSaleForm({
  data,
  hideDialog,
}: {
  data?: Sale;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const addSale = useSaleStore((state) => state.addSaleInList);

  const vehiclesList = useVehicleStore((state) => state.vehicleList);
  const setVehiclesList = useVehicleStore((state) => state.setVehicleList);

  const clientsList = useClientStore((state) => state.clientList);
  const setClientsList = useClientStore((state) => state.setClientList);

  const sellersList = useSellerStore((state) => state.sellerList);
  const setSellersList = useSellerStore((state) => state.setSellerList);

  const [openVehicles, setOpenVehicles] = useState(false);
  const [openClients, setOpenClients] = useState(false);
  const [openSellers, setOpenSellers] = useState(false);

  useEffect(() => {
    if (vehiclesList.length === 0) {
      queryClient
        .fetchQuery({
          queryKey: ["vehicles"],
          queryFn: getVehicles,
        })
        .then((res) => setVehiclesList(res || []))
        .catch((err) => {
          toast({
            title: "Erro ao carregar veículos",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  }, [vehiclesList.length, setVehiclesList, toast, openVehicles]);

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

  const saleSchema = z
    .object({
      id: z.string().optional(),
      saleCode: z.string().optional(),
      entryValue: z.coerce
        .number()
        .min(0, "O valor de entrada deve ser positivo"),
      financedAmount: z.coerce.number().optional(),
      totalAmount: z.coerce.number().min(1, "O valor total é obrigatório"),
      client: z.string().min(1, "O cliente é obrigatório"),
      seller: z.string().min(1, "O vendedor é obrigatório"),
      vehicle: z.string().min(1, "O veículo é obrigatório"),
    })
    .refine(
      (schemaData) => {
        const calculatedTotal =
          (schemaData.entryValue || 0) + (schemaData.financedAmount || 0);

        if (selectedVehicle && calculatedTotal < selectedVehicle.price) {
          return false;
        }

        return true;
      },
      {
        message: "O valor total não pode ser menor que o preço do veículo",
        path: ["totalAmount"],
      }
    );

  const newSale = useMutation({
    mutationFn: createSale,
    onSuccess: (createdSale: Sale) => {
      queryClient.invalidateQueries({ queryKey: ["sales", "vehicle"] });
      addSale(createdSale);
      toast({
        title: "Venda registrada com sucesso!",
        description: "A nova venda foi adicionada à base de dados do sistema.",
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao registrar venda!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const uptSale = useMutation({
    mutationFn: (sale: SaleToUpdate) => updateSale(sale.id, sale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales", "vehicle"] });
      toast({
        title: "Venda atualizada com sucesso!",
        description: `A venda foi atualizada na base de dados.`,
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao atualizar venda!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateSale: SubmitHandler<z.infer<typeof saleSchema>> = (
    sale
  ) => {
    console.log(sale);
    newSale.mutate(sale as SaleToCreate);
  };

  const handleUpdateSale: SubmitHandler<z.infer<typeof saleSchema>> = (
    sale
  ) => {
    uptSale.mutate(sale as SaleToUpdate);
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      id: data?.id,
      saleCode: data?.saleCode,
      entryValue: data?.entryValue,
      financedAmount: data?.financedAmount,
      totalAmount: data?.totalAmount,
      client: data?.client.id,
      seller: data?.seller.id,
      vehicle: data?.vehicle.vehicleId,
    },
  });

  const { field: fieldClient } = useController({
    name: "client",
    control: control,
  });

  const { field: fieldVehicle } = useController({
    name: "vehicle",
    control: control,
  });

  const { field: fieldSeller } = useController({
    name: "seller",
    control: control,
  });

  const selectedClient = clientsList.find((e) => e.id === fieldClient.value);
  const selectedVehicle = vehiclesList.find(
    (e) => e.vehicleId === fieldVehicle.value
  );
  const selectedSeller = sellersList.find((e) => e.id === fieldSeller.value);

  const entryValue = watch("entryValue");
  const financedAmount = watch("financedAmount");

  useEffect(() => {
    const calculatedTotal: number =
      Number(entryValue || 0) + Number(financedAmount || 0);
    setValue("totalAmount", calculatedTotal, { shouldTouch: true, });
  }, [entryValue, financedAmount, setValue]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(data ? handleUpdateSale : handleCreateSale)}
    >
      {data && (
        <Label>
          <p>Código da Venda</p>
          <Input
            className="mt-2"
            placeholder="Código"
            disabled
            {...register("saleCode")}
          />
          {errors.saleCode && (
            <p className="mt-1 text-red-500 text-end">
              {errors.saleCode.message}
            </p>
          )}
        </Label>
      )}

      <Label>
        <p>Valor de Entrada</p>
        <Input
          className="mt-2"
          placeholder="Valor de entrada"
          {...register("entryValue")}
        />
        {errors.entryValue && (
          <p className="mt-1 text-red-500 text-end">
            {errors.entryValue.message}
          </p>
        )}
      </Label>

      <Label>
        <p>Valor Financiado (opcional)</p>
        <Input
          className="mt-2"
          placeholder="Valor financiado"
          {...register("financedAmount")}
        />
      </Label>

      <Label>
        <p>Valor Total</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="Valor total"
          disabled
          value={watch("totalAmount")}
          {...register("totalAmount")}
        />
        {errors.totalAmount && (
          <p className="mt-1 text-red-500 text-end">
            {errors.totalAmount.message}
          </p>
        )}
      </Label>

      <Label>
        <p>Valor Veículo</p>
        <Input
          className="mt-2 w-full"
          placeholder="Valor total"
          disabled
          value={selectedVehicle?.price || 0}
        />
      </Label>

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
        <p>Veículo</p>
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
              {selectedVehicle
                ? `${selectedVehicle.modelId.modelName} - ${selectedVehicle.modelId.modelYear} - ${selectedVehicle.color}`
                : "Selecione o Veículo"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <Command className="w-full">
              <CommandInput
                placeholder="Pesquise o veículo..."
                className="w-full"
              />
              <CommandList className="w-full">
                <CommandEmpty>Veículo não encontrado.</CommandEmpty>
                <CommandGroup>
                  {vehiclesList.map((vehicle, idx) => (
                    <CommandItem
                      key={idx}
                      value={`${vehicle.modelId.modelName} - ${vehicle.modelId.modelYear}`}
                      onSelect={() => {
                        setOpenVehicles(false);
                        setValue("vehicle", vehicle.vehicleId);
                      }}
                    >
                      {`${vehicle.modelId.modelName} - ${vehicle.modelId.modelYear} - ${vehicle.color}`}
                      <Check
                        className={cn(
                          "ml-auto",
                          vehicle.vehicleId === fieldVehicle.value
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
        {errors.vehicle && (
          <p className="mt-1 text-red-500 text-end">{errors.vehicle.message}</p>
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
