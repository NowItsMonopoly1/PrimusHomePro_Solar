// PRIMUS HOME PRO - Button Component
// M.P.A. Design System - Clean, professional buttons

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default' | 'destructive'
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
      // Primary: Amber - High visibility CTA
      primary:
        'bg-solar-primary text-white hover:bg-solar-primary-dark mpa-shadow-sm hover:mpa-shadow transition-all duration-200',
      default:
        'bg-solar-primary text-white hover:bg-solar-primary-dark mpa-shadow-sm hover:mpa-shadow transition-all duration-200',
      // Secondary: Deep Blue - Authority actions
      secondary:
        'bg-solar-secondary text-white hover:bg-solar-secondary-dark mpa-shadow-sm hover:mpa-shadow transition-all duration-200',
      // Outline: Clean border style
      outline:
        'border border-solar-gray-300 bg-white text-solar-gray-700 hover:bg-solar-gray-50 hover:border-solar-gray-400 transition-all duration-200',
      // Ghost: Minimal, for navigation
      ghost: 
        'bg-transparent text-solar-gray-600 hover:bg-solar-gray-100 hover:text-solar-gray-900 transition-all duration-200',
      // Destructive: Alert actions
      destructive:
        'bg-solar-danger text-white hover:bg-solar-danger-dark mpa-shadow-sm transition-all duration-200',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm font-medium rounded-lg',
      md: 'h-11 px-6 text-sm font-semibold rounded-lg',
      lg: 'h-12 px-8 text-base font-semibold rounded-lg',
      xl: 'h-14 px-10 text-lg font-bold rounded-xl',
    }

    const baseClasses = cn(
      'inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
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
