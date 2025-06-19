import { DataType, DisplayFormat } from "../types/types";

// Regex for US Dollar amounts (for INFERENCE of DisplayFormat)
const usDollarRegex = /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$|^\$?\d+(\.\d{2})?$/;

/**
 * Infers the DataType and a suggested DisplayFormat for a given value.
 */
function inferDataTypeAndFormat(value: any): {
  dataType: DataType;
  format: DisplayFormat;
} {
  const result = { dataType: DataType.Text, format: DisplayFormat.None }; // Default

  if (
    value === null ||
    typeof value === "undefined" ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return result; // Keep default for empty/null
  }

  if (typeof value === "boolean") {
    result.dataType = DataType.Boolean;
    return result;
  }

  if (typeof value === "number" && !isNaN(value)) {
    result.dataType = DataType.Number;
    return result; // Already a number, no special format inference unless it came from somewhere
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!isNaN(parseFloat(trimmedValue)) && isFinite(Number(trimmedValue))) {
      result.dataType = DataType.Number;
      return result;
    }

    if (usDollarRegex.test(trimmedValue)) {
      const numericValue = parseFloat(trimmedValue.replace(/[\$,]/g, ""));
      if (!isNaN(numericValue) && isFinite(numericValue)) {
        result.dataType = DataType.Number; // Underlying type is Number
        result.format = DisplayFormat.CurrencyUSD; // Suggested display format
        return result;
      }
    }

    if (/^(true|false|yes|no)$/i.test(trimmedValue)) {
      result.dataType = DataType.Boolean;
      return result;
    }

    const dateRegex =
      /^\d{4}[-/]\d{2}[-/]\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?(?:\.\d+Z?)?)?$/;
    if (
      dateRegex.test(trimmedValue) &&
      !isNaN(new Date(trimmedValue).getTime())
    ) {
      result.dataType = DataType.Date;
      return result;
    }
  }

  return result;
}

/**
 * Helper to cast a value to a specific DataType.
 * Now simpler as Dollar is not a storage type.
 */
function castValueToType(value: any, targetType: DataType): any {
  if (value === null || typeof value === "undefined") {
    return null;
  }

  switch (targetType) {
    case DataType.Number:
      // For numbers, strip common formatting (like dollar signs or commas) before parsing
      if (typeof value === "string") {
        const cleanedValue = value.replace(/[\$,%]/g, ""); // Also strip % if needed
        const num = Number(cleanedValue);
        return isNaN(num) ? null : num;
      }
      const num = Number(value);
      return isNaN(num) ? null : num;
    case DataType.Boolean:
      if (typeof value === "string") {
        const lower = String(value).toLowerCase().trim();
        if (lower === "true" || lower === "1" || lower === "yes") return true;
        if (lower === "false" || lower === "0" || lower === "no") return false;
      }
      return Boolean(value);
    case DataType.Date:
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString();
    case DataType.Text:
    default:
      return String(value);
  }
}

export { inferDataTypeAndFormat, castValueToType };
