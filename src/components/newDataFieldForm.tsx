import { Plus } from "lucide-react";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useState } from "react";
import DataFieldSelect from "./dataFieldSelect";
import { Input } from "./ui/input";
import { useDataSetStore } from "../store/store";
import { DataType, OperationType } from "../types/types";

export default function NewDataFieldForm() {
  const columns = useDataSetStore(state => state.columns)

  const [dataField1Options, ] = useState<string[]>(columns?.map(column => column.name));
  const [dataField2options, setDataField2Options] = useState<string[]>(columns?.map(column => column.name));

  const operationMap = new Map<string, string[]>([
    [
      DataType.NUMBER,
      [
        OperationType.ADD,
        OperationType.SUBTRACT,
        OperationType.MULTIPLY,
        OperationType.DIVIDE,
      ],
    ],
    [DataType.TEXT, [OperationType.CONCATENATE]],
  ]);

  const [operationOptions, setOperationOptions] = useState<string[]>([]);

  const FormSchema = z.object({
    dataFieldName: z
      .string({
        required_error: "Please provide a name for your new data field.",
      })
      .min(1, {
        message: "Your field name must at least be one character long.",
      }),
    field1: z.string({
      required_error: "Please select a field.",
    }),
    field2: z.string({
      required_error: "Please select a field.",
    }),
    operation: z.string({
      required_error:
        "Please select what kind of operation you want to perfom on the selected fields.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("tada", data);
  }

  const onChange = (value: string) => {
    const dataFieldType = columns.find(column => column.name === value).dataType;
    setOperationOptions(operationMap.get(dataFieldType));
    setDataField2Options(columns.filter(column => column.dataType === dataFieldType ).map(column => column.name));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="dataFieldName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Name your new data field"
                    {...field}
                    onChange={field.onChange}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="field1"
              render={({ field }) => (
                <FormItem>
                  <DataFieldSelect
                    field={field}
                    options={dataField1Options}
                    onChange={onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operation"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a field" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {operationOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="field2"
              render={({ field }) => (
                <FormItem>
                  <DataFieldSelect
                    onChange={(value: string) => {}}
                    field={field}
                    options={dataField2options}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
