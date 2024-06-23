import * as React from "react";
import InputMask from "react-input-mask";

import {cn} from "@/lib/utils";
import CurrencyInput from "react-currency-input-field";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    mask?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, ...props}, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-sm border border-black border-opacity-20 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

const MaskInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, mask = "+999 99 999 99 99", ...props}) => {
        return (
            <InputMask
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
                mask={mask}
                maskChar={null}
            />
        );
    }
);
MaskInput.displayName = "MaskInput";

const InputSpacer = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type}) => {
        return (
            <CurrencyInput
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                placeholder="Please enter a number"
                decimalsLimit={2}
            />
        );
    }
);
InputSpacer.displayName = "InputSpacer";

export {Input, MaskInput, InputSpacer};
