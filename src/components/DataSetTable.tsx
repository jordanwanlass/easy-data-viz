import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function DataSetTable(props: {
  dataSetMap: Map<string, (string | number)[]>;
}) {
   const { dataSetMap } = props;
   
    const headers = [...dataSetMap.keys()];
    const rowCount =
      dataSetMap.size > 0 ? dataSetMap.values().next().value.length : 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header: string, index: number) => (
            <TableHead key={`header-${header}-${index}`}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rowCount)].map((_, rowIndex: number) => (
          <TableRow key={`row-${rowIndex}`}>
            {headers.map((header: string, cellIndex: number) => (
              <TableCell key={`cell-${rowIndex}-${cellIndex}-${header}`}>
                {dataSetMap.get(header)?.[rowIndex] || ""}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
