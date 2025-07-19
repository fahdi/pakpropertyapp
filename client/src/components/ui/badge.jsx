import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success-600 text-white hover:bg-success-700",
        warning: "border-transparent bg-warning-500 text-white hover:bg-warning-600",
        accent: "border-transparent bg-accent-500 text-white hover:bg-accent-600",
        purple: "border-transparent bg-purple-600 text-white hover:bg-purple-700",
        teal: "border-transparent bg-teal-600 text-white hover:bg-teal-700",
        rose: "border-transparent bg-rose-600 text-white hover:bg-rose-700",
        featured: "border-transparent bg-accent-400 text-white shadow-soft",
        verified: "border-transparent bg-success-500 text-white shadow-soft",
        premium: "border-transparent bg-gradient-to-r from-accent-400 to-accent-500 text-white shadow-soft",
        new: "border-transparent bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-soft",
        hot: "border-transparent bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-soft",
        glass: "border-white/30 bg-white/20 backdrop-blur-sm text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 