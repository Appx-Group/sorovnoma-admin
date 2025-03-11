"use client"

import * as React from "react"
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn, dateFormatter } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MdOutlineClear } from "react-icons/md";
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

// Function to get minimum allowed date time (10 minutes from now)
export function getMinimumAllowedDateTime() {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes in milliseconds
}

// Function to check if a date is at least 10 minutes in the future
export function isValidFutureDate(date: Date) {
  const minAllowedTime = getMinimumAllowedDateTime();
  return date > minAllowedTime;
}

// Function to ensure a date is well-formed and in ISO format
export function toValidISOString(date: Date | string | number): string {
  // Create a new Date object to normalize the input
  const dateObj = new Date(date);
  
  // Verify it's a valid date
  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date");
  }
  
  // Return ISO string
  return dateObj.toISOString();
}

// Ensure a string is a valid ISO date format
export function validateAndFormatDate(dateValue: any): Date | undefined {
  if (!dateValue) return undefined;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return undefined;
    return date;
  } catch (e) {
    console.error("Invalid date format:", e);
    return undefined;
  }
}

const DateTimePicker = ({
  placeholder,
  date,
  setDate,
  className,
  disabled = false,
}: {
  placeholder: string,
  date?: Date | undefined,
  setDate?: (date: Date | undefined) => void,
  className?: React.ReactNode,
  disabled?: boolean,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isChoosingDate, setIsChoosingDate] = React.useState<boolean>(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [hours, setHours] = React.useState<string>(date ? format(date, "HH") : "12")
  const [minutes, setMinutes] = React.useState<string>(date ? format(date, "mm") : "00")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date)
      setHours(format(date, "HH"))
      setMinutes(format(date, "mm"))
    }
  }, [date])

  const onSelectDate = (date: Date | undefined) => {
    if (!date) {
      setDate?.(undefined);
      return;
    }

    const now = new Date();
    const minAllowedTime = getMinimumAllowedDateTime();

    // Ensure selected date is in the future
    if (date < minAllowedTime) {
      // If selected date is before minimum allowed time
      // Use the min allowed time instead (10 minutes from now)
      const newDate = new Date(selectedDate || now);
      newDate.setFullYear(minAllowedTime.getFullYear());
      newDate.setMonth(minAllowedTime.getMonth());
      newDate.setDate(minAllowedTime.getDate());
      
      // If current time is less than minimum, use minimum time
      if (newDate < minAllowedTime) {
        newDate.setHours(minAllowedTime.getHours());
        newDate.setMinutes(minAllowedTime.getMinutes());
      }
      
      setSelectedDate(newDate);
      setDate?.(newDate);
    } else {
      // If date is valid, keep original hour/minute if previously set
      const newDate = new Date(date);
      
      if (selectedDate) {
        // Only preserve time if a date was previously selected
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
      } else {
        // Default to current time + 30 minutes if no previous selection
        const defaultTime = new Date(now.getTime() + 30 * 60 * 1000);
        newDate.setHours(defaultTime.getHours());
        newDate.setMinutes(defaultTime.getMinutes());
      }
      
      // Ensure final date is valid and in the future
      if (newDate < minAllowedTime) {
        newDate.setTime(minAllowedTime.getTime() + 5 * 60 * 1000); // 5 minutes after minimum
      }
      
      setSelectedDate(newDate);
      setDate?.(newDate);
    }
  };

  const handleTimeChange = () => {
    if (!selectedDate) return;
    
    try {
      // Parse hours and minutes from input
      const hrs = parseInt(hours);
      const mins = parseInt(minutes);
      
      // Validate hours and minutes
      if (isNaN(hrs) || hrs < 0 || hrs > 23) {
        setError("Hours must be between 0-23");
        return;
      }
      
      if (isNaN(mins) || mins < 0 || mins > 59) {
        setError("Minutes must be between 0-59");
        return;
      }
      
      // Create a new date with the selected time
      const newDate = new Date(selectedDate);
      newDate.setHours(hrs);
      newDate.setMinutes(mins);
      
      // Validate that the new date is in the future
      const minAllowedTime = getMinimumAllowedDateTime();
      
      if (newDate < minAllowedTime) {
        // If time is in the past, default to minimum allowed time + 5 minutes
        const futureDate = new Date(minAllowedTime.getTime() + 5 * 60 * 1000);
        setHours(futureDate.getHours().toString().padStart(2, '0'));
        setMinutes(futureDate.getMinutes().toString().padStart(2, '0'));
        
        setSelectedDate(futureDate);
        setDate?.(futureDate);
        setError("Adjusted to future time");
        setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
      } else {
        // Valid future time
        setSelectedDate(newDate);
        setDate?.(newDate);
        setError(null);
        
        // Close popover after successful time selection
        setIsOpen(false);
        setIsChoosingDate(false);
      }
      
    } catch (e) {
      console.error("Error updating time:", e);
      setError("Invalid time format");
    }
  };

  const clearDateTime = () => {
    setSelectedDate(undefined)
    setDate?.(undefined)
    setError(null)
    setIsOpen(false)
  }

  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (!isChoosingDate && !disabled) {
          setIsOpen(open)
          if (!open) {
            setError(null)
          }
        }
      }}
    >
      <PopoverTrigger asChild>
        <div
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen)
              setIsChoosingDate(true)
            }
          }}
          className={cn(
            "w-full flex gap-1 items-center bg-white px-3 py-[8px] text-sm rounded border border-black/20 cursor-pointer",
            !date && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            <span>
              {format(date, "dd.MM.yyyy HH:mm")}
            </span>
          ) : (
            <span>{placeholder || "Pick a date and time"}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Pick a date and time</h3>
            <div
              className="flex items-end text-orange-600 cursor-pointer gap-1"
              onClick={clearDateTime}
            >
              <span className="text-sm">Clear</span>
              <MdOutlineClear className="text-base" />
            </div>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            initialFocus
            fromDate={getMinDate()}
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <Label htmlFor="hours">Time</Label>
            </div>
            <div className="flex gap-2">
              <div>
                <Input
                  id="hours"
                  className="w-16"
                  value={hours}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^([0-1]?[0-9]|2[0-3])$/.test(value) || value === "") {
                      setHours(value.padStart(2, "0"))
                    }
                  }}
                  type="text"
                  placeholder="HH"
                  maxLength={2}
                />
              </div>
              <span className="text-lg">:</span>
              <div>
                <Input
                  id="minutes"
                  className="w-16"
                  value={minutes}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^[0-5]?[0-9]$/.test(value) || value === "") {
                      setMinutes(value.padStart(2, "0"))
                    }
                  }}
                  type="text"
                  placeholder="MM"
                  maxLength={2}
                />
              </div>
              <Button 
                type="button" 
                className="ml-2"
                onClick={handleTimeChange}
                disabled={!selectedDate}
              >
                Apply
              </Button>
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateTimePicker 