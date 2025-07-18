import { XCircle } from "lucide-react";
import { useDataSetStore } from "../store/store";
import { ColumnData, RowData } from "~/types/data-types";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function DataSetTable() {
  const { data, columnData } = useDataSetStore((state) => state);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columnData.map((column: ColumnData, index: number) => (
            <TableHead key={`header-${column.name}-${index}`}>
              <div className="flex items-center gap-2">
              {column.name}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => console.log("hello")}
                className="h-4 w-4 rounded-full cursor-pointer"
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Remove ETL Operation</span>
              </Button>
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row: RowData, rowIndex: number) => (
          <TableRow key={`row-${rowIndex}`}>
            {columnData.map((column: ColumnData, cellIndex: number) => (
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
