import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { useSaleStore } from "@/app/stores/saleStore";
import { createSale, updateSale } from "../../data/queries";
import { Sale, SaleToCreate, SaleToUpdate } from "@/app/stores/saleStore";

export function CreateSaleForm({
  data,
  hideDialog,
}: {
  data?: Sale;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const addSale = useSaleStore((state) => state.addSaleInList);

  const saleSchema = z.object({
    id: z.string().optional(),
    saleCode: z.string().min(1, "O código da venda é obrigatório"),
    saleDate: z.date({ required_error: "A data da venda é obrigatória" }),
    entryValue: z.number().min(0, "O valor de entrada deve ser positivo"),
    financedAmount: z.number().optional(),
    totalAmount: z.string().min(1, "O valor total é obrigatório"),
    client: z.string().min(1, "O cliente é obrigatório"),
    seller: z.string().min(1, "O vendedor é obrigatório"),
    vehicle: z.string().min(1, "O veículo é obrigatório"),
  });

  const newSale = useMutation({
    mutationFn: createSale,
    onSuccess: (createdSale: Sale) => {
      addSale(createdSale);
      toast({
        title: "Venda registrada com sucesso!",
        description:
          "A nova venda foi adicionada à base de dados do sistema.",
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
      queryClient.invalidateQueries({ queryKey: ["sales"] });
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

  const handleCreateSale: SubmitHandler<z.infer<typeof saleSchema>> = (sale) => {
    newSale.mutate(sale as SaleToCreate);
  };

  const handleUpdateSale: SubmitHandler<z.infer<typeof saleSchema>> = (sale) => {
    uptSale.mutate({ ...sale, id: sale.id || "" });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      id: data?.id,
      saleCode: data?.saleCode,
      saleDate: data?.saleDate,
      entryValue: data?.entryValue,
      financedAmount: data?.financedAmount,
      totalAmount: data?.totalAmount,
      client: data?.client.id,
      seller: data?.seller.id,
      vehicle: data?.vehicle.vehicleId,
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(data ? handleUpdateSale : handleCreateSale)}
    >
      <Label>
        <p>Código da Venda</p>
        <Input
          className="mt-2"
          placeholder="Código"
          {...register("saleCode")}
        />
        {errors.saleCode && (
          <p className="mt-1 text-red-500 text-end">
            {errors.saleCode.message}
          </p>
        )}
      </Label>

      <Label>
        <p>Data da Venda</p>
        <Input
          className="mt-2"
          type="date"
          {...register("saleDate", { valueAsDate: true })}
        />
        {errors.saleDate && (
          <p className="mt-1 text-red-500 text-end">
            {errors.saleDate.message}
          </p>
        )}
      </Label>

      <Label>
        <p>Valor de Entrada</p>
        <Input
          className="mt-2"
          type="number"
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
          type="number"
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
          {...register("totalAmount")}
        />
        {errors.totalAmount && (
          <p className="mt-1 text-red-500 text-end">
            {errors.totalAmount.message}
          </p>
        )}
      </Label>

      <Label>
        <p>Cliente</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="ID do cliente"
          {...register("client")}
        />
        {errors.client && (
          <p className="mt-1 text-red-500 text-end">{errors.client.message}</p>
        )}
      </Label>

      <Label>
        <p>Vendedor</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="ID do vendedor"
          {...register("seller")}
        />
        {errors.seller && (
          <p className="mt-1 text-red-500 text-end">{errors.seller.message}</p>
        )}
      </Label>

      <Label>
        <p>Veículo</p>
        <Input
          className="mt-2"
          type="text"
          placeholder="ID do veículo"
          {...register("vehicle")}
        />
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
