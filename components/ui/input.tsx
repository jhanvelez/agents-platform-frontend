import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  span?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, span, ...props }, ref) => {
    return (
      <div>
        <div className="flex justify-between">
          <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            {label}
          </label>
          <span id="email-optional" className="text-sm/6 text-gray-500 dark:text-gray-400">
            {span}
          </span>
        </div>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-2 focus-visible:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
