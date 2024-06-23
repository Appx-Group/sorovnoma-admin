"use client"

import * as React from "react"
import {CalendarIcon} from "@radix-ui/react-icons"

import {cn, dateFormatter} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {MdOutlineClear} from "react-icons/md";

const DatePickerDemo = ({placeholder, date, setDate, className}: {
    placeholder: string,
    date?: Date | undefined,
    setDate?: (date: Date | undefined) => void,
    className?: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isChoosingDate, setIsChoosingDate] = React.useState<boolean>(false)

    const onSelectDate = (date: Date | undefined) => {
        setIsOpen(false)
        setIsChoosingDate(false)
        setDate?.(date)
    }

    return (
        <Popover
            open={isOpen}
            onOpenChange={(open) => {
                if (!isChoosingDate) {
                    setIsOpen(open)
                }
            }}
        >
            <PopoverTrigger asChild>
                <div
                    onClick={() => {
                        setIsOpen(!isOpen)
                        setIsChoosingDate(true)
                    }}
                    className={cn(
                        "w-full flex gap-1 items-center bg-white px-3 py-[8px] text-sm rounded border border-black/20 cursor-pointer",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {date ? <span>{dateFormatter(String(date), false)}</span> :
                        <span>{placeholder || "Pick a date"}</span>}
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="flex flex-col gap-1"
            >
                <div className={"flex justify-end"}>
                    <div className={"flex items-end text-orange-600 cursor-pointer gap-1"}
                         onClick={() => {
                             setIsOpen(!isOpen)
                             setDate?.(undefined)
                         }}>
                        <span className={"text-sm "}>Clear date</span>
                        <MdOutlineClear className={"text-base"}/>
                    </div>
                </div>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onSelectDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePickerDemo
