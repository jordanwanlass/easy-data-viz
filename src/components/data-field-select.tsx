import { ControllerRenderProps } from "react-hook-form/dist";
import { FormControl } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function DataFieldSelect(props: {
  options: string[];
  field: any;
  onChange: (value: string) => void;
}) {
  const { options, field, onChange } = props;

  return (
    <Select
      onValueChange={(value) => {
        onChange(value);
        field.onChange(value);
      }}
      defaultValue={field.value}
    >
      <FormControl>
        <SelectTrigger className="w-[135]">
          <SelectValue placeholder="Select a field" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          {options.map((option: string) => (
            <SelectItem key={`first-${option}`} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
