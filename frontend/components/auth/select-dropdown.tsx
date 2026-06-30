"use client";

import { ShieldUser, UserStar } from "lucide-react";
import type { ReactElement } from "react";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IconPlaceholderProps {
  className?: string;
  hugeicons: string;
  lucide: string;
  phosphor: string;
  remixicon: string;
  tabler: string;
}

interface Item {
  icon: ReactElement<IconPlaceholderProps>;
  label: string;
  value: string | null;
}

const items: Item[] = [
  {
    label: "Parent/Guardian",
    value: "parent",
    icon: <UserStar className="size-4 text-muted-foreground" />,
  },
  {
    label: "Teacher",
    value: "teacher",
    icon: <ShieldUser className="size-4 text-muted-foreground" />,
  },
];

export function SelectDropdown() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={items[0]} items={items}>
        <SelectTrigger className="w-50">
          <SelectValue>
            {(item: (typeof items)[number]) => (
              <span className="flex items-center gap-2">
                {item.icon}
                <span>{item?.label}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {items.map((items) => (
              <SelectItem key={items.value} value={items}>
                <span className="flex items-center gap-2">
                  {items.icon}
                  <span>{items.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
