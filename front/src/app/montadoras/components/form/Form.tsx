import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Automaker } from "@/app/stores/automakerStore";
import { createAutomaker, updateAutomaker } from "../../data/queries";
import { validateCNPJ } from "@/utils/CNPJvalidation";

export function CreateAutomakerForm({
  data,
  hideDialog,
}: {
  data?: Automaker;
  hideDialog: () => void;
}) {
  const { toast } = useToast();

  const automakerSchema = z.object({
    id: z.string().optional(),
    cnpj: z
      .string()
      .min(14, "O campo CNPJ deve ter 14 dígitos")
      .max(14, "O campo CNPJ deve ter 14 dígitos")
      .refine(validateCNPJ, {
        message: "CNPJ inválido",
      }),
    corporateName: z.string().min(1, "O campo Razão Social é obrigatório"),
    brand: z.string().min(1, "O campo Marca é obrigatório"),
    email: z.string().email("Email inválido").min(1, "O campo Email é obrigatório"),
    businessPhone: z.string().min(1, "O campo Telefone Comercial é obrigatório"),
    cellPhone: z.string(),
  });

  const newAutomaker = useMutation({
    mutationFn: createAutomaker,
    onSuccess: (createdAutomaker: Automaker) => {
      toast({
        title: "Montadora criada com sucesso!",
        description: "Nova montadora foi registrada com sucesso na base de dados!",
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao criar nova montadora!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const uptAutomaker = useMutation({
    mutationFn: (automaker: Automaker) => updateAutomaker(automaker.id, automaker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automakers"] });
      hideDialog();
      toast({
        title: "Montadora atualizada com sucesso!",
        description: `A montadora ${data?.corporateName} foi atualizada com sucesso!`,
        // style: { backgroundColor: "green", color: "white" },
        className: "bg-emerald-600 text-white"
      });
    },
    onError: (err) => {
      toast({
        title: "Erro ao atualizar a montadora!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateAutomaker: SubmitHandler<z.infer<typeof automakerSchema>> = (
    automaker
  ) => {
    newAutomaker.mutate(automaker);
  };

  const handleUpdateAutomaker: SubmitHandler<z.infer<typeof automakerSchema>> = (
    automaker
  ) => {
    const id = automaker?.id || "";
    uptAutomaker.mutate({ ...automaker, id: id });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof automakerSchema>>({
    resolver: zodResolver(automakerSchema),
    defaultValues: {
      id: data?.id,
      cnpj: data?.cnpj,
      corporateName: data?.corporateName,
      brand: data?.brand,
      email: data?.email,
      businessPhone: data?.businessPhone,
      cellPhone: data?.cellPhone,
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(data ? handleUpdateAutomaker : handleCreateAutomaker)}
    >
      <Label className="w-full">
        <p>CNPJ</p>
        <Input className="mt-2" placeholder="CNPJ" {...register("cnpj")} />
        {errors.cnpj && (
          <p className="mt-1 text-red-500 text-end">{errors.cnpj.message}</p>
        )}
      </Label>

      <Label className="w-full">
        <p>Razão Social</p>
        <Input
          className="mt-2"
          placeholder="Razão Social"
          {...register("corporateName")}
        />
        {errors.corporateName && (
          <p className="mt-1 text-red-500 text-end">
            {errors.corporateName.message}
          </p>
        )}
      </Label>

      <Label className="w-full">
        <p>Marca</p>
        <Input className="mt-2" placeholder="Marca" {...register("brand")} />
        {errors.brand && (
          <p className="mt-1 text-red-500 text-end">{errors.brand.message}</p>
        )}
      </Label>

      <Label className="w-full">
        <p>Email</p>
        <Input className="mt-2" placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-red-500 text-end">{errors.email.message}</p>
        )}
      </Label>

      <Label className="w-full">
        <p>Telefone Comercial</p>
        <Input
          className="mt-2"
          placeholder="Telefone Comercial"
          {...register("businessPhone")}
        />
        {errors.businessPhone && (
          <p className="mt-1 text-red-500 text-end">
            {errors.businessPhone.message}
          </p>
        )}
      </Label>

      <Label className="w-full">
        <p>Telefone Celular</p>
        <Input
          className="mt-2"
          placeholder="Telefone Celular"
          {...register("cellPhone")}
        />
        {errors.cellPhone && (
          <p className="mt-1 text-red-500 text-end">
            {errors.cellPhone.message}
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
