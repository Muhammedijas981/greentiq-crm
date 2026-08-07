import { ReactNode } from "react";
import {
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path, ControllerRenderProps } from "react-hook-form";

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  children: (field: ControllerRenderProps<T, Path<T>>) => ReactNode;
}

export default function FormField<T extends FieldValues>({
  control,
  name,
  label,
  children
}: CustomFormFieldProps<T>) {
  return (
    <ShadcnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-muted-foreground">{label}</FormLabel>
          <FormControl>
            {children(field)}
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
}
