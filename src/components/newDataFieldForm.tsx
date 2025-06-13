import { Plus } from "lucide-react";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { DataFieldType } from "../lib/helpers";
import DataFieldSelect from "./dataFieldSelect";

export default function NewDataFieldForm(props: {
  dataFieldTypes: Map<string, string>;
}) {
  const { dataFieldTypes } = props;
  const [combiningNumbers, setCombiningNumbers] = useState<boolean>(true);

  const handleChange = (value: string) => {
    setCombiningNumbers(dataFieldTypes.get(value) === DataFieldType.NUMBER);
  };



  const dataFields = dataFieldTypes ? [...dataFieldTypes?.keys()] : [];
  return (
    <div className="flex gap-2">
      <DataFieldSelect dataFields={dataFields} handleChange={handleChange} />

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a field" />
        </SelectTrigger>
        <SelectContent>
          {combiningNumbers ? (
            <SelectGroup>
              <SelectItem key="add" value="+">
                Add
              </SelectItem>
              <SelectItem key="subtract" value="-">
                Subtract
              </SelectItem>
              <SelectItem key="multiply" value="*">
                Multiply
              </SelectItem>
              <SelectItem key="divide" value="/">
                Divide
              </SelectItem>
            </SelectGroup>
          ) : (
            <SelectGroup>
              <SelectItem key="combine" value="combine">
                Combine
              </SelectItem>
            </SelectGroup>
          )}
        </SelectContent>
      </Select>

      <DataFieldSelect dataFields={dataFields} handleChange={null} />
      <Button>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
