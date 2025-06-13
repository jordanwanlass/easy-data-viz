import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "./ui/dialog";

export default function AddDataDialog() {
  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger className="flex">
          <Plus className="h-4 w-4" />
          Add Data
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>Combine fields to create new data.</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
