import { DataType, DisplayFormat } from "../types/types";

const usDollarRegex = /^\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?$|^\$?\d+(?:\.\d{2})?$/;

const percentageRegex = /^(-?\d+(?:\.\d+)?)\s*%$/;

/**
 * Infers the DataType and a suggested DisplayFormat for a given value.
 */
function inferDataTypeAndFormat(value: any): {
  dataType: DataType;
  format: DisplayFormat;
} {
  const result = { dataType: DataType.Text, format: DisplayFormat.None };

  if (
    value === null ||
    typeof value === "undefined" ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return result;
  }

  if (typeof value === "boolean") {
    result.dataType = DataType.Boolean;
    return result;
  }

  if (typeof value === "number" && !isNaN(value)) {
    result.dataType = DataType.Number;
    return result;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!isNaN(parseFloat(trimmedValue)) && isFinite(Number(trimmedValue))) {
      result.dataType = DataType.Number;
      return result;
    }

    if (percentageRegex.test(trimmedValue)) {
      const cleanedValue = trimmedValue.replace('%', '');
      const numericValue = parseFloat(cleanedValue);
      if (!isNaN(numericValue) && isFinite(numericValue)) {
        result.dataType = DataType.Number;
        result.format = DisplayFormat.Percentage;
        return result;
      }
    }

    if (usDollarRegex.test(trimmedValue)) {
      const cleanedValue = trimmedValue.replace(/[\$,]/g, '');
      const numericValue = parseFloat(cleanedValue);
      if (!isNaN(numericValue) && isFinite(numericValue)) {
        result.dataType = DataType.Number;
        result.format = DisplayFormat.CurrencyUSD;
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
        return (lower === "true" || lower === "1" || lower === "yes") || !(lower === "false" || lower === "0" || lower === "no")
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
