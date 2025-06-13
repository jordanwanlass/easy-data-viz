import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function DataFieldSelect(props: {
  dataFields: string[];
}) {
  const { dataFields } = props;

  return (
    <Select>
      <SelectTrigger className="w-[135]">
        <SelectValue placeholder="Select a field" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dataFields.map((dataField: string) => (
            <SelectItem key={`first-${dataField}`} value={dataField}>
              {dataField}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
