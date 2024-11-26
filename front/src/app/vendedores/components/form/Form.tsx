import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Seller, useSellerStore } from "@/app/stores/sellerStore";
import { createSeller, updateSeller } from "../../data/queries";

export function CreateSellerForm({
  data,
  hideDialog,
}: {
  data?: Seller;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const addSeller = useSellerStore((state) => state.addSellerInList);

  const sellerSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "O campo Nome é obrigatório"),
    registration: z.string().min(1, "O campo Matrícula é obrigatório"),
  });

  const newSeller = useMutation({
    mutationFn: createSeller,
    onSuccess: (createdClient: Seller) => {
      addSeller(createdClient);
      toast({
        title: "Cliente criado com sucesso!",
        description:
          "Novo cliente foi registrado com sucesso na base de dados do sistema!",
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao criar novo cliente!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const uptSeller = useMutation({
    mutationFn: (seller: Seller) => updateSeller(seller.id, seller),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      hideDialog();
      toast({
        title: "Cliente atualizado com sucesso!",
        description: `O cliente ${data?.name} foi atualizado com sucesso na base de dados do sistema!`,
        style: { backgroundColor: "green", color: "white" },
      });
    },
    onError: (err) => {
      toast({
        title: "Erro ao atualizar o cliente!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateClient: SubmitHandler<z.infer<typeof sellerSchema>> = (
    seller
  ) => {
    newSeller.mutate(seller);
  };

  const handleUpdateClient: SubmitHandler<z.infer<typeof sellerSchema>> = (
    seller
  ) => {
    const id = seller?.id || "";
    uptSeller.mutate({ ...seller, id: id });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof sellerSchema>>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      registration: data?.registration,
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(data ? handleUpdateClient : handleCreateClient)}
    >
      <div className="flex flex-col gap-4 mt-2">
        <Label className="w-full">
          <p>Nome</p>
          <Input
            className="mt-2"
            placeholder="Nome completo..."
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-red-500 text-end">{errors.name.message}</p>
          )}
        </Label>

        <Label className="w-full">
          <p>Matrícula</p>
          <Input
            className="mt-2"
            placeholder="CPF"
            {...register("registration")}
          />
          {errors.registration && (
            <p className="mt-1 text-red-500 text-end">
              {errors.registration.message}
            </p>
          )}
        </Label>
      </div>
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
