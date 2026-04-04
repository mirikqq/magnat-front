import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-base)] border text-sm font-medium transition disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        colored: 'border-transparent bg-[image:var(--button-gradient)] text-white shadow-[0_10px_22px_rgba(15,23,42,0.16)]',
        transparent: 'border-[color:var(--button-border)] bg-white text-slate-700 shadow-none',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        default: 'h-9 px-3.5 text-sm',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'transparent',
      size: 'default',
      fullWidth: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>