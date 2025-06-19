import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { XCircle } from "lucide-react";
import { ColumnData } from "../types/types";

interface DataFieldSelectRowProps {
  operationIndex: number;
  sourceColumnIndex: number;
  onRemove: (sourceColumnIndex: number) => void;
  availableColumns: ColumnData[];
  showRemoveButton: boolean;
}

export function DataFieldSelectRow({
  operationIndex,
  sourceColumnIndex,
  onRemove,
  availableColumns,
  showRemoveButton,
}: DataFieldSelectRowProps) {
  const { control } = useFormContext();

  const fieldName = `etlOperations.${operationIndex}.sourceColumns.${sourceColumnIndex}.columnName`;

  return (
    <div className="flex items-center gap-2">
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} ({col.dataType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {showRemoveButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(sourceColumnIndex)}
        >
          <XCircle className="h-4 w-4" />
          <span className="sr-only">Remove Source Column</span>
        </Button>
      )}
    </div>
  );
}
