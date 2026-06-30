"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Clipboard,
  ClipboardIndicator,
  ClipboardTrigger,
  ClipboardValue,
} from "@/components/ui/clipboard";

export const ClassCode = ({
  defaultValue = "—",
  action,
}: {
  defaultValue: string;
  action?: string | any;
}) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <div className="flex w-full flex-1 flex-col gap-2">
      <Clipboard className="w-full" value={value}>
        <ClipboardValue className="w-full" />

        <ClipboardTrigger asChild>
          <Button>
            <ClipboardIndicator />
          </Button>
        </ClipboardTrigger>
      </Clipboard>

      <Button
        onClick={() =>
          setValue(value === defaultValue ? "newCode" : defaultValue)
        }
        variant="secondary"
      >
        Change Code
      </Button>
    </div>
  );
};
