// PRIMUS HOME PRO - Button Component
// Reusable button primitive with solar brand styling

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default' | 'destructive' | 'solar' | 'solar-outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading, children, disabled, asChild, ...props },
    ref
  ) => {
    const variants = {
      primary:
        'bg-solar-primary text-solar-gray-900 hover:bg-solar-primary-dark shadow-md hover:shadow-lg transition-all duration-200',
      default:
        'bg-solar-primary text-solar-gray-900 hover:bg-solar-primary-dark shadow-md hover:shadow-lg transition-all duration-200',
      secondary:
        'bg-solar-secondary text-white hover:bg-solar-secondary-dark shadow-md hover:shadow-lg transition-all duration-200',
      outline:
        'border-2 border-solar-secondary bg-transparent text-solar-secondary hover:bg-solar-secondary hover:text-white transition-all duration-200',
      ghost: 'hover:bg-solar-gray-100 text-solar-gray-700 transition-all duration-200',
      destructive:
        'bg-solar-danger text-white hover:bg-solar-danger-dark shadow-md hover:shadow-lg transition-all duration-200',
      solar:
        'solar-gradient text-solar-gray-900 font-semibold shadow-lg hover:shadow-xl solar-glow hover:solar-glow-lg transition-all duration-300',
      'solar-outline':
        'border-2 border-solar-primary bg-transparent text-solar-primary hover:bg-solar-primary hover:text-solar-gray-900 transition-all duration-200',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm font-medium',
      md: 'h-11 px-6 text-base font-semibold',
      lg: 'h-12 px-8 text-lg font-semibold',
      xl: 'h-14 px-10 text-xl font-bold',
    }

    const baseClasses = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
      variants[variant],
      sizes[size],
      className
    )

    // If asChild, render children directly with classes
    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        className: baseClasses,
        ref,
      })
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
