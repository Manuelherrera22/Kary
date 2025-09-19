import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-700">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-200"
        style={{ width: `${((props.value?.[0] || 0) - (props.min || 0)) / ((props.max || 100) - (props.min || 0)) * 100}%` }}
      />
    </div>
    <div 
      className="absolute h-4 w-4 rounded-full bg-purple-500 border-2 border-white shadow-lg transition-all duration-200 hover:scale-110"
      style={{ left: `calc(${((props.value?.[0] || 0) - (props.min || 0)) / ((props.max || 100) - (props.min || 0)) * 100}% - 8px)` }}
    />
  </div>
))
Slider.displayName = "Slider"

export { Slider }


