import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils/cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
                              options,
                              value,
                              onChange,
                              placeholder = "Select...",
                            }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full min-h-10 flex items-center justify-between rounded-md border px-3 py-2 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((v) => {
                const item = options.find((o) => o.value === v);
                return (
                  <Badge key={v} className="mr-1">
                    {item?.label}
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>

          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((opt) => {
                const selected = value.includes(opt.value);

                return (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => toggleValue(opt.value)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
