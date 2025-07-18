import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ColumnData, DataType, DisplayFormat, OperationType } from "~/types/data-types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { XCircle, PlusCircle } from "lucide-react";
import { DataFieldSelectRow } from "./data-field-select-row";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

interface DataFieldRowProps {
  operationIndex: number;
  onRemove: (index: number) => void;
  availableColumns: ColumnData[];
  operationOptions: {
    value: string;
    label: string;
    minSourceColumns?: number;
    maxSourceColumns?: number;
    applicableTypes?: DataType[];
    applicableFormats?: DisplayFormat[];
  }[];
}

export function DataFieldRow({
  operationIndex,
  onRemove,
  availableColumns,
  operationOptions,
}: DataFieldRowProps) {
  const { control, setValue } = useFormContext();

  const {
    fields: sourceColumnFields,
    append: appendSourceColumn,
    remove: removeSourceColumn,
  } = useFieldArray({
    control,
    name: `etlOperations.${operationIndex}.sourceColumns`,
  });

  const selectedOperation = useWatch({
    control,
    name: `etlOperations.${operationIndex}.operation`,
    defaultValue: OperationType.Custom,
  });

  const currentOperationType = operationOptions.find(
    (opt) => opt.value === selectedOperation,
  );
  const minSourceColumns = currentOperationType?.minSourceColumns || 1;
  const maxSourceColumns = currentOperationType?.maxSourceColumns || Infinity;

  const columnOptions = availableColumns.filter((col) => {
    return currentOperationType.applicableTypes.includes(col.dataType);
  });

  const formatOptions = Object.values(DisplayFormat).filter((opt) => {
    return currentOperationType.applicableFormats.includes(opt);
  })

  useEffect(() => {
    setValue(`etlOperations.${operationIndex}.sourceColumns.0.columnName`, columnOptions[0]?.name)
    setValue(`etlOperations.${operationIndex}.newColumnFormat`, formatOptions[0])
  },[selectedOperation])

  const handleAddSourceColumn = () => {
    if (sourceColumnFields.length < maxSourceColumns) {
      appendSourceColumn({ id: uuidv4(), columnName: "" });
    }
  };

  return (
    <div className="flex flex-col gap-4 border p-4 rounded-md mb-4 relative bg-card text-card-foreground shadow-sm">
      {/* Remove Operation Button */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onRemove(operationIndex)}
        className="absolute top-2 right-2 h-4 w-4 rounded-full cursor-pointer"
      >
        <XCircle className="h-4 w-4" />
        <span className="sr-only">Remove ETL Operation</span>
      </Button>

      {/* New Column Name */}
      <FormField
        control={control}
        name={`etlOperations.${operationIndex}.newColumnName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Column Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Calculated Value" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Operation Select */}
      <FormField
        control={control}
        name={`etlOperations.${operationIndex}.operation`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Operation</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                const newOperationDef = operationOptions.find(
                  (opt) => opt.value === value,
                );
                const newMin = newOperationDef?.minSourceColumns || 1;
                const newMax = newOperationDef?.maxSourceColumns || Infinity;
                if (sourceColumnFields.length < newMin) {
                  for (let i = sourceColumnFields.length; i < newMin; i++) {
                    appendSourceColumn({ id: uuidv4(), columnName: "" });
                  }
                } else if (sourceColumnFields.length > newMax) {
                  for (
                    let i = sourceColumnFields.length - 1;
                    i >= newMax;
                    i--
                  ) {
                    removeSourceColumn(i);
                  }
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an operation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {operationOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Dynamic Source Column Selects */}
      <div className="flex flex-col gap-2 border p-3 rounded-md bg-muted/20">
        <div className="flex justify-between items-center mb-1">
          <FormLabel className="text-sm font-medium">
            Source Column(s)
          </FormLabel>
          {sourceColumnFields.length < maxSourceColumns && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSourceColumn}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Source Column
            </Button>
          )}
        </div>
        {sourceColumnFields.map((field, srcColIndex) => (
          <DataFieldSelectRow
            key={field.id}
            operationIndex={operationIndex}
            sourceColumnIndex={srcColIndex}
            onRemove={removeSourceColumn}
            availableColumns={columnOptions}
            showRemoveButton={sourceColumnFields.length > minSourceColumns}
          />
        ))}
        {sourceColumnFields.length < minSourceColumns && (
          <FormMessage className="text-xs text-destructive">
            This operation requires at least {minSourceColumns} source
            column(s).
          </FormMessage>
        )}
      </div>

      {/* Conditional Custom Formula Field */}
      {selectedOperation === OperationType.Custom && (
        <FormField
          control={control}
          name={`etlOperations.${operationIndex}.customFormula`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Formula</FormLabel>
              <FormControl>
                <Input placeholder="e.g., (Col1 + Col2) * 1.05" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* New Column Format Select (User Override) */}
      <FormField
        control={control}
        name={`etlOperations.${operationIndex}.newColumnFormat`} // <-- Field name
        render={({ field }) => (
          <FormItem>
            <FormLabel>Output Format</FormLabel> {/* Renamed label to reflect its broader role */}
            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value || DisplayFormat.None}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {formatOptions.map(format => (
                  <SelectItem key={format} value={format}>{format}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              How the new column's values will be displayed and implicitly determines the underlying data type.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
