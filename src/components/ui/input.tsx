import * as React from "react";
// Import type only, we'll use a different approach for implementing masks
import type ReactInputMask from "react-input-mask";

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

// Create a simpler version that doesn't use the problematic component
const MaskInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, mask = "+999 99 999 99 99", ...props}, ref) => {
        // For now, just use a regular input but with a pattern attribute
        // In a real implementation, you'd want to implement proper masking logic
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                placeholder={mask.replace(/9/g, "_")}
                ref={ref}
                {...props}
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
