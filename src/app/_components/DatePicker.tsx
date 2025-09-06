"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"

import { ControllerRenderProps } from "react-hook-form";
import { FormValues } from "@/lib/types";

import { FieldPathByValue } from "react-hook-form";

type DatePickerProps<T extends FieldPathByValue<FormValues, Date | undefined>> = {
  field: ControllerRenderProps<FormValues, T>;
};

export function DatePicker<T extends FieldPathByValue<FormValues, Date | undefined>>({ field }: DatePickerProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          captionLayout="dropdown"
          fromYear={1960}
          toYear={2030}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}