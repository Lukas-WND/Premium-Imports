import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { useOrderStore } from "@/app/stores/orderStore";
import { createOrder, updateOrder } from "../../data/queries";
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
import { CreateOrderDto, Order, UpdateOrderDto } from "@/app/stores/orderStore";
import { useAutomakerStore } from "@/app/stores/automakerStore";
import { getAutomakers } from "@/app/montadoras/data/queries";
import { useModelStore } from "@/app/stores/modelStore";
import { getModels } from "@/app/modelos/data/queries";

export function CreateSaleForm({
  data,
  hideDialog,
}: {
  data?: Order;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const addOrder = useOrderStore((state) => state.addOrderInList);

  const modelList = useModelStore((state) => state.modelList);
  const setModelList = useModelStore((state) => state.setModelList);

  const automakerList = useAutomakerStore((state) => state.automakerList);
  const setAutomakerList = useAutomakerStore((state) => state.setAutomakerList);

  const clientsList = useClientStore((state) => state.clientList);
  const setClientsList = useClientStore((state) => state.setClientList);

  const sellersList = useSellerStore((state) => state.sellerList);
  const setSellersList = useSellerStore((state) => state.setSellerList);

  const [openAutomaker, setOpenAutomaker] = useState(false);
  const [openClients, setOpenClients] = useState(false);
  const [openSellers, setOpenSellers] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  useEffect(() => {
    if (modelList.length === 0) {
      queryClient
        .fetchQuery({
          queryKey: ["models"],
          queryFn: getModels,
        })
        .then((res) => setModelList(res || []))
        .catch((err) => {
          toast({
            title: "Erro ao carregar modelos",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  }, [modelList.length, setModelList, toast, openModel]);

  useEffect(() => {
    if (automakerList.length === 0) {
      queryClient
        .fetchQuery({
          queryKey: ["automakers"],
          queryFn: getAutomakers,
        })
        .then((res) => setAutomakerList(res || []))
        .catch((err) => {
          toast({
            title: "Erro ao carregar montadoras",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  }, [automakerList.length, setAutomakerList, toast, openAutomaker]);

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

  const orderSchema = z.object({
    id: z.string().optional(),
    orderValue: z.coerce.number().min(0, "O valor do pedido deve ser positivo"),
    client: z.string().min(1, "O cliente é obrigatório"),
    seller: z.string().min(1, "O vendedor é obrigatório"),
    automaker: z.string().min(1, "A montadora é obrigatória"),
    color: z.string().min(1, "A cor é obrigatória"),
    modelId: z.string().optional(),
    modelName: z.string().optional(),
    modelYear: z.number().optional(),
  });

  const newOrder = useMutation({
    mutationFn: createOrder,
    onSuccess: (createdOrder: Order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Pedido registrado com sucesso!",
        description: "O novo pedido foi adicionado à base de dados do sistema.",
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao registrar pedido!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const uptOrder = useMutation({
    mutationFn: (order: UpdateOrderDto) => updateOrder(order.id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Pedido atualizado com sucesso!",
        description: `O pedido foi atualizado na base de dados.`,
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao atualizar pedido!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateSale: SubmitHandler<z.infer<typeof orderSchema>> = (
    order
  ) => {
    newOrder.mutate(order as CreateOrderDto);
  };

  const handleUpdateSale: SubmitHandler<z.infer<typeof orderSchema>> = (
    order
  ) => {
    uptOrder.mutate(order as UpdateOrderDto);
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      id: data?.id,
      orderValue: data?.orderValue,
      client: data?.client.id,
      seller: data?.seller.id,
      automaker: data?.automaker.id,
      color: data?.color,
      modelId: data?.modelId,
      modelName: data?.modelName,
      modelYear: data?.modelYear,
    },
  });

  const { field: fieldClient } = useController({
    name: "client",
    control: control,
  });

  const { field: fieldAutomaker } = useController({
    name: "automaker",
    control: control,
  });

  const { field: fieldSeller } = useController({
    name: "seller",
    control: control,
  });

  const { field: fieldModel } = useController({
    name: "modelId",
    control: control,
  });

  const selectedClient = clientsList.find((e) => e.id === fieldClient.value);
  const selectedAutomaker = automakerList.find(
    (e) => e.id === fieldAutomaker.value
  );
  const selectedSeller = sellersList.find((e) => e.id === fieldSeller.value);
  const selectedModel = modelList.find((e) => e.modelId === fieldModel.value);

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
            value={data.orderCode}
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
        <p>Montadora</p>
        <Popover
          open={openAutomaker}
          onOpenChange={(open) => setOpenAutomaker(open)}
        >
          <PopoverTrigger asChild>
            <Button
              className="w-full mt-2"
              variant="outline"
              role="combobox"
              onClick={() => setOpenAutomaker(true)}
            >
              {selectedAutomaker
                ? `${selectedAutomaker.corporateName}`
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
                <CommandEmpty>Montadora não encontrada.</CommandEmpty>
                <CommandGroup>
                  {automakerList.map((automaker, idx) => (
                    <CommandItem
                      key={idx}
                      value={`${automaker.corporateName}`}
                      onSelect={() => {
                        setOpenAutomaker(false);
                        setValue("automaker", automaker.id);
                      }}
                    >
                      {automaker.corporateName}
                      <Check
                        className={cn(
                          "ml-auto",
                          automaker.id === fieldAutomaker.value
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
        {errors.automaker && (
          <p className="mt-1 text-red-500 text-end">
            {errors.automaker.message}
          </p>
        )}
      </Label>

      <Label>
        <p>Modelo</p>
        <Popover open={openModel} onOpenChange={(open) => setOpenModel(open)}>
          <PopoverTrigger asChild>
            <Button
              className="w-full mt-2"
              variant="outline"
              role="combobox"
              onClick={() => setOpenModel(true)}
            >
              {selectedModel
                ? `${selectedModel.modelName}`
                : "Selecione o Modelo"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <Command className="w-full">
              <CommandInput
                placeholder="Pesquise o modelo..."
                className="w-full"
              />
              <CommandList className="w-full">
                <CommandEmpty>Modelo não encontrado.</CommandEmpty>
                <CommandGroup>
                  {modelList.map((model, idx) => (
                    <CommandItem
                      key={idx}
                      value={model.modelName}
                      onSelect={() => {
                        setOpenModel(false);
                        setValue("modelId", model.modelId);
                      }}
                    >
                      {`${model.modelName} ${model.modelYear}`}
                      <Check
                        className={cn(
                          "ml-auto",
                          model.modelId === fieldModel.value
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
        {errors.automaker && (
          <p className="mt-1 text-red-500 text-end">
            {errors.automaker.message}
          </p>
        )}
      </Label>

      <Label>
        <p>Valor do pedido</p>
        <Input
          className="mt-2"
          placeholder="Valor de entrada"
          {...register("orderValue")}
        />
        {errors.orderValue && (
          <p className="mt-1 text-red-500 text-end">
            {errors.orderValue.message}
          </p>
        )}
      </Label>

      <Label>
        <p>Cor</p>
        <Input
          className="mt-2"
          placeholder="Valor financiado"
          {...register("color")}
        />
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
