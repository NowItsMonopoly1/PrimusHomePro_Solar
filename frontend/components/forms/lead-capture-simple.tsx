'use client'

// PRIMUS HOME PRO - Template 1: Simple Hero Form
// High-conversion, solar-branded lead capture

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadCaptureSchema, type LeadCaptureFormData } from '@/lib/validations/lead'
import { createLead } from '@/lib/actions/create-lead'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, Sun, Shield, Clock, Star, Zap } from 'lucide-react'

interface LeadCaptureSimpleProps {
  headline?: string
  subheadline?: string
  source?: string
  ctaText?: string
}

export function LeadCaptureSimple({
  headline = 'Get Your Free Solar Estimate',
  subheadline = 'Save up to 70% on electricity bills. Free installation assessment. No pressure, just savings.',
  source = 'LandingPage-Simple',
  ctaText = 'Get My Free Quote',
}: LeadCaptureSimpleProps) {
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadCaptureFormData>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      source,
    },
  })

  async function onSubmit(data: LeadCaptureFormData) {
    const result = await createLead(data)

    if (result.success) {
      setIsSuccess(true)
    } else {
      alert(result.error)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-solar-bg p-6">
        <Card variant="solar" className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full solar-gradient shadow-xl solar-glow">
              <CheckCircle2 className="h-10 w-10 text-solar-gray-900" />
            </div>
            <CardTitle className="text-3xl">You're All Set! 🎉</CardTitle>
            <CardDescription className="text-base text-solar-gray-600">
              We've received your request. A solar expert will contact you within 24 hours to
              discuss your personalized savings estimate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-solar-gray-500">
              Check your email for confirmation details.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-solar-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-solar-secondary via-solar-secondary-dark to-solar-secondary"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-solar-primary/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
                <Sun className="w-5 h-5 text-solar-primary" />
                <span className="text-sm font-medium text-white">Free Solar Assessment</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                {headline}
              </h1>
              
              <p className="text-xl text-white/80 mb-8 max-w-lg mx-auto lg:mx-0">
                {subheadline}
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Shield className="w-5 h-5 text-solar-success" />
                  <span className="text-sm text-white">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-solar-primary" />
                  <span className="text-sm text-white">24-Hour Response</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-solar-primary fill-solar-primary" />
                  <span className="text-sm text-white">4.9/5 Rating</span>
                </div>
              </div>
            </div>
            
            {/* Right - Form */}
            <div>
              <Card variant="glass" className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <div className="w-14 h-14 solar-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Zap className="w-7 h-7 text-solar-gray-900" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-solar-gray-900">Start Saving Today</CardTitle>
                  <CardDescription className="text-solar-gray-600">
                    Get your personalized solar quote in minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                      {...register('name')}
                      placeholder="Your Full Name"
                      error={errors.name?.message}
                      variant="solar"
                    />

                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="Email Address"
                      error={errors.email?.message}
                      variant="solar"
                    />

                    <Input
                      {...register('phone')}
                      type="tel"
                      placeholder="Phone Number"
                      error={errors.phone?.message}
                      variant="solar"
                    />

                    <Input
                      {...register('message')}
                      placeholder="Your Address (for satellite analysis)"
                      variant="solar"
                    />

                    <Button
                      type="submit"
                      variant="solar"
                      size="xl"
                      className="w-full"
                      isLoading={isSubmitting}
                    >
                      {ctaText}
                      <ArrowRight className="w-5 h-5" />
                    </Button>

                    <p className="text-xs text-center text-solar-gray-500">
                      🔒 Your information is secure. We never share your data.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Social Proof Bar */}
      <div className="bg-white border-t border-solar-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-solar-secondary">500+</div>
              <div className="text-sm text-solar-gray-600">Installations</div>
            </div>
            <div>
              <div className="text-3xl font-black text-solar-secondary">$2.5M+</div>
              <div className="text-sm text-solar-gray-600">Customer Savings</div>
            </div>
            <div>
              <div className="text-3xl font-black text-solar-secondary">4.9★</div>
              <div className="text-sm text-solar-gray-600">Google Rating</div>
            </div>
            <div>
              <div className="text-3xl font-black text-solar-secondary">25yr</div>
              <div className="text-sm text-solar-gray-600">Warranty</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
