import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary hover:brightness-110 active:brightness-90",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent",
        outline:
          "bg-transparent text-foreground border border-border hover:border-ring",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
      },
      size: {
        default: "h-9 gap-2 px-4 rounded-sm",
        sm: "h-8 gap-1.5 px-3 rounded-sm text-xs",
        xs: "h-6 gap-1 px-2 rounded-sm text-xs",
        lg: "h-10 gap-2 px-5 rounded-sm",
        icon: "size-9 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
