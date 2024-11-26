import { z } from "zod";
import { Model, useModelStore } from "@/app/stores/modelStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createModel, updateModel } from "../../data/queries";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";

export function CreateModelForm({
  data,
  hideDialog,
}: {
  data?: Model;
  hideDialog: () => void;
}) {
  const { toast } = useToast();
  const addModel = useModelStore((state) => state.addModelInList);

  const modelSchema = z.object({
    modelId: z.string().optional(),
    modelName: z.string().min(1, "O campo Nome do Modelo é obrigatório"),
    modelYear: z.coerce.number().min(1, "O campo Ano do Modelo é obrigatório"),
  });

  const newModel = useMutation({
    mutationFn: createModel,
    onSuccess: (createdModel: Model) => {
      addModel(createdModel);
      toast({
        title: "Modelo Criado com sucesso!",
        description:
        "Novo modelo foi registrado com sucesso na base de dados do sistema!",
        style: { backgroundColor: "green", color: "white" },
      });
      hideDialog();
    },
    onError: (err) => {
      toast({
        title: "Erro ao criar novo modelo!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const uptModel = useMutation({
    mutationFn: ({
      modelId,
      updates,
    }: {
      modelId: string;
      updates: Partial<Omit<Model, "modelId">>;
    }) => updateModel(modelId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      hideDialog();
      toast({
        title: "Modelo atualizado com sucesso!",
        description: `O modelo ${data?.modelName} foi atualizado com sucesso na base de dados do sistema!`,
        style: { backgroundColor: "green", color: "white" },
      });
    },
    onError: (err) => {
      toast({
        title: "Erro ao atualizar o modelo!",
        description: `${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateModel: SubmitHandler<z.infer<typeof modelSchema>> = (
    model
  ) => {
    newModel.mutate(model);
  };

  const handleUpdateModel: SubmitHandler<z.infer<typeof modelSchema>> = (
    model
  ) => {
    const modelId = model.modelId || "";
    const updates = {
      modelName: model.modelName,
      modelYear: model.modelYear,
    };
    uptModel.mutate({ modelId, updates });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isLoading },
  } = useForm<z.infer<typeof modelSchema>>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      modelId: data?.modelId,
      modelName: data?.modelName,
      modelYear: data?.modelYear,
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(data ? handleUpdateModel : handleCreateModel)}
    >
      <div className="flex flex-col gap-4 mt-2">
        <Label className="w-full">
          <p>Nome do Modelo</p>
          <Input
            className="mt-2"
            placeholder="Modelo..."
            {...register("modelName", { required: "Campo obrigatório" })}
          />
          {errors.modelName && (
            <p className="mt-1 text-red-500 text-end">
              {errors.modelName.message}
            </p>
          )}
        </Label>

        <Label className="w-full">
          <p>Ano do Modelo</p>
          <Input
            className="mt-2"
            placeholder="Ano..."
            {...register("modelYear", { required: "Campo obrigatório" })}
          />
          {errors.modelYear && (
            <p className="mt-1 text-red-500 text-end">
              {errors.modelYear.message}
            </p>
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
