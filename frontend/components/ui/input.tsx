// PRIMUS HOME PRO - Input Component
// Reusable input primitive with solar brand styling

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  variant?: 'default' | 'solar'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'border-solar-gray-300 bg-white focus-visible:ring-solar-primary focus-visible:border-solar-primary',
      solar: 'border-solar-secondary/30 bg-solar-gray-50 focus-visible:ring-solar-primary focus-visible:border-solar-primary',
    }
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-solar-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-lg border-2 px-4 py-3 text-base text-solar-gray-900 ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-solar-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-solar-gray-100',
            variants[variant],
            error && 'border-solar-danger focus-visible:ring-solar-danger',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm font-medium text-solar-danger">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
