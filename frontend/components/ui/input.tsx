// PRIMUS HOME PRO - Input Component
// M.P.A. Design System - Clean, accessible inputs

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
            'flex h-11 w-full rounded-lg border border-solar-gray-300 bg-white px-4 py-2 text-base text-solar-gray-900 placeholder:text-solar-gray-400 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-solar-primary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-solar-gray-50',
            error && 'border-solar-danger focus:ring-solar-danger',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-solar-danger">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
