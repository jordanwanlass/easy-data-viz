import { DataFieldRowSchema } from "../schemas/etl-form-schema";
import {
  ColumnData,
  DataType,
  DisplayFormat,
  OperationType,
  RowData,
} from "~/types/data-types";
import { inferDataTypeAndFormat, castValueToType } from "../lib/helpers";
import * as math from "mathjs";

/**
 * Helper function to map DisplayFormat to DataType.
 * This determines the underlying storage type based on the chosen display format.
 * If DisplayFormat.None is chosen, it falls back to the type inferred from the operation itself.
 */
function mapDisplayFormatToDataType(
  format: DisplayFormat,
  inferredFromOperation?: DataType
): DataType {
  switch (format) {
    case DisplayFormat.CurrencyUSD:
    case DisplayFormat.Percentage:
      return DataType.Number;
    case DisplayFormat.None:
    default:
      return inferredFromOperation || DataType.Text;
  }
}

/**
 * Performs a single ETL operation to create a new column based on a given configuration.
 * It takes the current dataset and processes it row by row according to the operation config.
 *
 * @param originalData The current array of row data (before this operation).
 * @param allColumnData All currently defined columns (including existing ones),
 *                               used for looking up types of source columns.
 * @param operationConfig The configuration for this specific ETL operation from the form.
 * @returns An object containing the new dataset with the added column, and the data of the new column.
 */
function performComplexETL(
  originalData: RowData[],
  allColumnData: ColumnData[],
  operationConfig: DataFieldRowSchema
): { processedData: RowData[]; newColumnData: ColumnData } {
  const {
    newColumnName,
    newColumnFormat,
    operation,
    sourceColumns,
    customFormula,
  } = operationConfig;

  const sourceColumnNames = sourceColumns
    .map((sc) => sc.columnName)
    .filter(Boolean);

  if (sourceColumnNames.length === 0 && operation !== OperationType.Custom) {
    throw new Error(
      `Operation '${operation}' requires at least one source column.`
    );
  }

  let inferredDataType: DataType = DataType.Text;

  let valueResolverFn: (row: RowData, rowIndex: number) => any;

  const sourceColumnDataMap = new Map<string, ColumnData>();
  allColumnData
    .filter((col) => sourceColumnNames.includes(col.name))
    .map((col) => sourceColumnDataMap.set(col.name, col));

  switch (operation) {
    case OperationType.Negate:
    case OperationType.Absolute:
      if (sourceColumnNames.length !== 1) {
        throw new Error(
          `'${operation}' operation requires exactly one source column.`
        );
      }
      valueResolverFn = (row) => {
        const value = castValueToType(
          row[sourceColumnNames[0]],
          DataType.Number
        );
        if (typeof value !== "number" || isNaN(value)) return null;
        return operation === OperationType.Negate ? -value : Math.abs(value);
      };
      inferredDataType = DataType.Number;
      break;

    case OperationType.Add:
    case OperationType.Subtract:
    case OperationType.Multiply:
    case OperationType.Divide:
      if (sourceColumnNames.length < 2) {
        throw new Error(
          `'${operation}' operation requires at least two source columns.`
        );
      }
      valueResolverFn = (row) => {
        let result: number | null = null;

        const firstVal = castValueToType(
          row[sourceColumnNames[0]],
          DataType.Number
        );
        if (typeof firstVal === "number" && !isNaN(firstVal)) {
          result = firstVal;
        } else {
          return null;
        }

        for (let i = 1; i < sourceColumnNames.length; i++) {
          const nextVal = castValueToType(
            row[sourceColumnNames[i]],
            DataType.Number
          );
          if (typeof nextVal !== "number" || isNaN(nextVal)) return null;

          switch (operation) {
            case OperationType.Add:
              result += nextVal;
              break;
            case OperationType.Subtract:
              result -= nextVal;
              break;
            case OperationType.Multiply:
              result *= nextVal;
              break;
            case OperationType.Divide:
              if (nextVal === 0) {
                return null;
              }
              result /= nextVal;
              break;
          }
        }
        return result;
      };
      inferredDataType = DataType.Number;
      break;

    case OperationType.Combine:
      if (sourceColumnNames.length < 2) {
        throw new Error(
          `'${OperationType.Combine}' operation requires at least two source columns.`
        );
      }
      valueResolverFn = (row) =>
        sourceColumnNames
          .map((colName) => String(row[colName] || ""))
          .join(" ");
      inferredDataType = DataType.Text;
      break;

    case OperationType.Custom:
      if (!customFormula || customFormula.trim() === "") {
        throw new Error(
          'Custom formula cannot be empty for "Custom Formula" operation.'
        );
      }

      let compiledExpression: math.EvalFunction;
      try {
        compiledExpression = math.compile(customFormula);
      } catch (e) {
        console.error("Math.js formula compilation error:", e);
        throw new Error(
          `Invalid custom formula: ${e instanceof Error ? e.message : String(e)}`
        );
      }

      valueResolverFn = (row) => {
        const scope: { [key: string]: any } = {};
        sourceColumnNames.forEach((colName) => {
          const colData = sourceColumnDataMap.get(colName);
          scope[colName] = castValueToType(
            row[colName],
            colData?.dataType || inferDataTypeAndFormat(row[colName]).dataType
          );
        });

        try {
          const result = compiledExpression.evaluate(scope);
          inferredDataType = inferDataTypeAndFormat(result).dataType;
          return result;
        } catch (e) {
          console.error(
            `Math.js evaluation error for formula "${customFormula}" with row data ${JSON.stringify(scope)}:`,
            e
          );
          return null;
        }
      };
      break;

    default:
      throw new Error(`Unknown or unhandled operation: ${operation}`);
  }

  const finalColumnDataType = mapDisplayFormatToDataType(
    newColumnFormat,
    inferredDataType
  );

  const processedData: RowData[] = originalData.map((row, rowIndex) => {
    const newValue = valueResolverFn(row, rowIndex);
    return {
      ...row,
      [newColumnName]: castValueToType(newValue, finalColumnDataType),
    };
  });

  const newColumnDataItem: ColumnData = {
    name: newColumnName,
    dataType: finalColumnDataType,
    format: newColumnFormat,
  };

  return { processedData, newColumnData: newColumnDataItem };
}

export { performComplexETL };
