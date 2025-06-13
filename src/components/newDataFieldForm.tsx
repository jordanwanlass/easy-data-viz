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
import DataFieldSelect from "./dataFieldSelect";
import { Input } from "./ui/input";

export default function NewDataFieldForm(props: {
  dataFieldTypes: Map<string, string>;
}) {
  const { dataFieldTypes } = props;
  const [combiningNumbers, setCombiningNumbers] = useState<boolean>(true);

  const dataFields = dataFieldTypes ? [...dataFieldTypes?.keys()] : [];
  return (
    <div className="flex flex-col gap-4">
      <Input placeholder="Name your new data field" />
      <div className="flex gap-2">
        <DataFieldSelect dataFields={dataFields} />

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

        <DataFieldSelect dataFields={dataFields} />
        <Button>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
