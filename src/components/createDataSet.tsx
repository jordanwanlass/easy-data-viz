import { useState } from "react";
import { Input } from "./ui/input";
import parse from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function CreateDataSet() {
  const [file, setFile] = useState<File | null>(null);
  const [dataSetMap, setDataSetMap] = useState<Map<string, (string | number)[]>>(new Map<string, (string | number)[]>());

  const handFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputedFile = event.target.files?.[0];

    if (inputedFile) {
      parse.parse(inputedFile, {
        header: true,
        complete: function (results: parse.ParseResult<Record<string, string>>) {
          if (results.data.length > 0) {
            const headers = Object.keys(results.data[0]);
            const newDataSetMap = new Map<string, (string | number)[]>();
            
            headers.forEach(header => {
              newDataSetMap.set(header, results.data.map(row => row[header] || ''));
            });
            setDataSetMap(newDataSetMap);
            setFile(inputedFile);
          }
        },
      });
    } else {
      console.log("No file selected");
    }
  };

  const headers = [...dataSetMap.keys()];
  const rowCount = dataSetMap.size > 0 ? dataSetMap.values().next().value.length : 0;

  return (
    <div className={`h-full grid ${file ? "py-4 px-4" : "items-center justify-center"}`}>
      {file ? (
        <div>
          <div>Row above that has options (add data)</div>
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
                      {dataSetMap.get(header)?.[rowIndex] || ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid w-full max-w-sm items-center gap-3">
          <div>Upload your file to begin defining your data set.</div>
          <Input
            id="dataSet"
            type="file"
            accept=".csv, .xlsx, .tsv"
            onChange={handFileChange}
          />
        </div>
      )}
    </div>
  );
}
