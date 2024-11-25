import { z } from "zod";
import { Model } from "@/app/stores/modelStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createModel, updateModel } from "../../data/queries";

export function CreateModelForm({ data }: { data?: Model }) {
  const modelSchema = z.object({
    modelId: z.string().optional(),
    modelName: z.string().min(1, "O campo Nome do Modelo é obrigatório"),
    modelYear: z.string().min(1, "O campo Ano do Modelo é obrigatório"),
  });

  const newModel = useMutation({
    mutationFn: createModel,
  });

  const uptModel = useMutation({
    mutationFn: ({
      modelId,
      updates,
    }: {
      modelId: string;
      updates: Partial<Omit<Model, "modelId">>;
    }) => updateModel(modelId, updates),
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
        <Button variant="outline" type="button">Cancelar</Button>
      </div>
    </form>
  );
}
