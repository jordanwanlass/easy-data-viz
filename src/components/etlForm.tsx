import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { etlFormSchema, EtlFormValues } from "../schemas/etlFormSchema";
import { DataType, OperationType } from "../types/types";
import { useDataSetStore } from "../store/store";

import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { DataFieldRow } from "./dataFieldRow";
import { Plus } from "lucide-react";

interface ETLFormProps {
  onSubmit: (values: EtlFormValues) => void;
}

const commonOperationOptions = [
  {
    value: OperationType.Negate,
    label: "Negate Value",
    minSourceColumns: 1,
    maxSourceColumns: 1,
    applicableTypes: [DataType.Number],
  },
  {
    value: OperationType.Absolute,
    label: "Absolute Value",
    minSourceColumns: 1,
    maxSourceColumns: 1,
    applicableTypes: [DataType.Number],
  },
  {
    value: OperationType.Add,
    label: "Add (Col + Col + ...)",
    minSourceColumns: 2,
    applicableTypes: [DataType.Number],
  },
  {
    value: OperationType.Subtract,
    label: "Subtract (Col - Col - ...)",
    minSourceColumns: 2,
    applicableTypes: [DataType.Number],
  },
  {
    value: OperationType.Multiply,
    label: "Multiply (Col * Col * ...)",
    minSourceColumns: 2,
    applicableTypes: [DataType.Number],
  },
  {
    value: OperationType.Divide,
    label: "Divide (Col / Col / ...)",
    minSourceColumns: 2,
    applicableTypes: [DataType.Number],
  },
  {
    value: OperationType.Combine,
    label: "Concatenate (Col + Col + ...)",
    minSourceColumns: 2,
    applicableTypes: [DataType.Text],
  },
  {
    value: OperationType.Custom,
    label: "Custom Formula",
    minSourceColumns: 1,
    maxSourceColumns: Infinity,
    applicableTypes: [DataType.Number],
  },
];

export function ETLForm({ onSubmit }: ETLFormProps) {
  const availableColumns = useDataSetStore((state) => state.columnData);

  const form = useForm<EtlFormValues>({
    resolver: zodResolver(etlFormSchema),
    defaultValues: {
      etlOperations: [
        {
          id: uuidv4(),
          newColumnName: "",
          dataType: DataType.Number,
          operation: OperationType.Custom,
          sourceColumns: [{ id: uuidv4(), columnName: "" }],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "etlOperations",
  });

  const handleAddDataField = () => {
    append({
      id: uuidv4(),
      newColumnName: "",
      dataType: DataType.Number,
      operation: OperationType.Custom,
      sourceColumns: [{ id: uuidv4(), columnName: "" }],
    });
  };

  const handleSubmit = async (values: EtlFormValues) => {
    console.log("Form Values:", values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col border-b pb-4 mb-4">
          <Button
            type="button"
            onClick={handleAddDataField}
            className="self-start"
          >
            <Plus className="h-4 w-4" />
            Add Data Field
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-center text-gray-500">
            Click "Add Data Field" to define a new column.
          </p>
        )}

        {fields.map((field, index: number) => (
          <DataFieldRow
            key={field.id}
            operationIndex={index}
            onRemove={() => remove(index)}
            availableColumns={availableColumns}
            operationOptions={commonOperationOptions}
          />
        ))}

        {fields.length > 0 && (
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
