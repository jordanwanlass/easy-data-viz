// schemas/etlFormSchema.ts
import { z } from "zod";
import { DataType, OperationType } from "../types/types"; // Assuming ColumnType enum

// Schema for a single source column selection within an operation
export const singleSourceColumnSchema = z.object({
  id: z.string().uuid().optional(),
  columnName: z.string().min(1, { message: "Select a source column" }),
});

// Define a schema for a single DataFieldRow (representing ONE ETL operation)
export const dataFieldRowSchema = z.object({
  id: z.string().uuid().optional(),
  newColumnName: z.string().min(1, { message: "New column name is required" }),
  dataType: z.nativeEnum(DataType).default(DataType.TEXT), // User can pick or infer
  operation: z.nativeEnum(OperationType).default(OperationType.CUSTOM),
  // Now, a dynamic array of source columns for this operation
  sourceColumns: z
    .array(singleSourceColumnSchema)
    .min(1, {
      message: "At least one source column is required for this operation",
    }),
  // Conditional for 'customFormula' operation
  customFormula: z.string().optional(),
});

export const etlFormSchema = z.object({
  etlOperations: z.array(dataFieldRowSchema),
});

export type SingleSourceColumnSchema = z.infer<typeof singleSourceColumnSchema>;
export type DataFieldRowSchema = z.infer<typeof dataFieldRowSchema>;
export type EtlFormValues = z.infer<typeof etlFormSchema>;
