import { useDataSetStore } from "../store/store";
import { ColumnData, RowData } from "../types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function DataSetTable() {
  const { data, columns } = useDataSetStore((state) => state);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column: ColumnData, index: number) => (
            <TableHead key={`header-${column.name}-${index}`}>
              {column.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row: RowData, rowIndex: number) => (
          <TableRow key={`row-${rowIndex}`}>
            {columns.map((column: ColumnData, cellIndex: number) => (
              <TableCell key={`cell-${rowIndex}-${cellIndex}-${column.name}`}>
                {row[column.name] || ""}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
