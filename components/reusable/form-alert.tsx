import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheck, AlertTriangle } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const formAlertVariants = cva(
  "p-3 rounded-md flex items-center gap-x-2 text-sm",
  {
    variants: {
      variant: {
        success: "bg-emerald-500/15 text-emerald-500",
        error: "bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  },
);

export interface FormAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formAlertVariants> {
  message?: string;
}

const FormAlert = React.forwardRef<HTMLDivElement, FormAlertProps>(
  ({ className, message, variant = "error", ...props }, ref) => {
    if (!message) return null;

    return (
      <div
        className={cn(formAlertVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {variant === "success" && <CircleCheck className="h-4 w-4" />}
        {variant === "error" && <AlertTriangle className="h-4 w-4" />}
        <p>{message}</p>
      </div>
    );
  },
);

FormAlert.displayName = "FormAlert";

export { FormAlert, formAlertVariants };
