import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Client, useClientStore } from "@/app/stores/clientStore";
import { createClient, updateClient } from "../../data/queries";
import { validateCPF } from "@/utils/CPFValidation";

export function CreateClientForm({
  data,
  hideDialog,
}: {
  data?: Client;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const addClient = useClientStore((state) => state.addClientInList);

  const clientSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "O campo Nome é obrigatório"),
    cpf: z
      .string()
      .min(11, "O campo CPF deve ter 11 dígitos")
      .max(11, "O campo CPF deve ter 11 dígitos")
      .refine(validateCPF, {
        message: "CPF inválido",
      }),
    state: z.string().min(1, "O campo Estado é obrigatório"),
    city: z.string().min(1, "O campo Cidade é obrigatório"),
    neighborhood: z.string().min(1, "O campo Bairro é obrigatório"),
    income: z.coerce.number().min(1, "O campo Renda é obrigatório"),
    cellPhone: z.string().min(1, "O campo Telefone Celular é obrigatório"),
    homePhone: z.string().optional(),
  });

  const newClient = useMutation({
    mutationFn: createClient,
    onSuccess: (createdClient: Client) => {
      addClient(createdClient);
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

  const uptClient = useMutation({
    mutationFn: (client: Client) => updateClient(client.id, client),
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

  const handleCreateClient: SubmitHandler<z.infer<typeof clientSchema>> = (
    client
  ) => {
    newClient.mutate(client);
  };

  const handleUpdateClient: SubmitHandler<z.infer<typeof clientSchema>> = (
    client
  ) => {
    const id = client?.id || "";
    uptClient.mutate({ ...client, id: id });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      cpf: data?.cpf,
      income: data?.income,
      state: data?.state,
      city: data?.city,
      neighborhood: data?.neighborhood,
      cellPhone: data?.cellPhone,
      homePhone: data?.homePhone,
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
          <p>CPF</p>
          <Input className="mt-2" placeholder="CPF" {...register("cpf")} />
          {errors.cpf && (
            <p className="mt-1 text-red-500 text-end">{errors.cpf.message}</p>
          )}
        </Label>

        <div className="flex w-full gap-4">
          <Label className="w-1/3">
            <p>Estado</p>
            <Input
              className="mt-2"
              placeholder="Estado"
              {...register("state")}
            />
            {errors.state && (
              <p className="mt-1 text-red-500 text-end">
                {errors.state.message}
              </p>
            )}
          </Label>

          <Label className="w-2/3">
            <p>Cidade</p>
            <Input
              className="mt-2"
              placeholder="Cidade"
              {...register("city")}
            />
            {errors.city && (
              <p className="mt-1 text-red-500 text-end">
                {errors.city.message}
              </p>
            )}
          </Label>
        </div>

        <Label className="w-full">
          <p>Bairro</p>
          <Input
            className="mt-2"
            placeholder="Bairro"
            {...register("neighborhood")}
          />
          {errors.neighborhood && (
            <p className="mt-1 text-red-500 text-end">
              {errors.neighborhood.message}
            </p>
          )}
        </Label>

        <Label className="w-full">
          <p>Renda</p>
          <Input className="mt-2" placeholder="Renda" {...register("income")} />
          {errors.income && (
            <p className="mt-1 text-red-500 text-end">
              {errors.income.message}
            </p>
          )}
        </Label>

        <div className="flex w-full gap-4">
          <Label className="w-1/2">
            <p>Telefone Celular</p>
            <Input
              className="mt-2"
              placeholder="Celular"
              {...register("cellPhone")}
            />
            {errors.cellPhone && (
              <p className="mt-1 text-red-500 text-end">
                {errors.cellPhone.message}
              </p>
            )}
          </Label>

          <Label className="w-1/2">
            <p>Telefone Residencial</p>
            <Input
              className="mt-2"
              placeholder="Telefone Residencial"
              {...register("homePhone")}
            />
            {errors.homePhone && (
              <p className="mt-1 text-red-500 text-end">
                {errors.homePhone.message}
              </p>
            )}
          </Label>
        </div>
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
