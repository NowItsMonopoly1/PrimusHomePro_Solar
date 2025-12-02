// PRIMUS HOME PRO - Presentation Mode (Kitchen Table Close)
// Full-screen, Chrome-Free Presentation for iPad/Tablet Sales

'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Sun, TrendingUp, Zap, DollarSign, Calendar, ArrowRight, Leaf } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Mock proposal data - In production, fetch from API via proposalId
const MOCK_PROPOSAL = {
  homeowner: 'Sarah & Mike Thompson',
  address: '456 Maple Avenue, Springfield',
  systemSize: 8.5,
  panelCount: 24,
  currentBill: 285,
  newBill: 42,
  monthlySavings: 243,
  yearOneSavings: 2916,
  savings25Year: 67420,
  breakEvenYears: 6.2,
  systemCost: 25500,
  federalTaxCredit: 7650,
  netCost: 17850,
  payoffMonths: 74,
  co2Offset: 127.5, // tons over 25 years
}

export default function PresentationModePage({ 
  params 
}: { 
  params: { proposalId: string } 
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSignature, setShowSignature] = useState(false)

  const slides = [
    { id: 'current-bill', title: 'Your Current Situation', component: <CurrentBillSlide /> },
    { id: 'new-system', title: 'Your New Solar Roof', component: <NewSystemSlide /> },
    { id: 'savings', title: 'Your Savings', component: <SavingsSlide /> },
    { id: 'signature', title: 'Sign Here', component: <SignatureSlide onShowSignature={() => setShowSignature(true)} /> },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Swipe handlers for mobile/iPad
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide()
    }
    if (touchStart - touchEnd < -75) {
      prevSlide()
    }
  }

  return (
    <div 
      className="h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Minimal Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-solar-secondary rounded-xl flex items-center justify-center">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">Primus Home Pro</div>
            <div className="text-xs text-slate-500">Solar Proposal</div>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          {MOCK_PROPOSAL.homeowner}
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 overflow-hidden relative">
        <div 
          className="h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          <div className="flex h-full">
            {slides.map((slide) => (
              <div key={slide.id} className="min-w-full h-full">
                {slide.component}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            currentSlide === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          ← Back
        </button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-solar-secondary'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            currentSlide === slides.length - 1
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-solar-secondary text-white hover:bg-solar-secondary-dark'
          }`}
        >
          Next →
        </button>
      </div>

      {/* Signature Modal */}
      {showSignature && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Sign Your Agreement</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-xl h-48 mb-4 flex items-center justify-center bg-slate-50">
              <p className="text-slate-500">Signature Pad Integration</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSignature(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Signature captured! Agreement sent to homeowner.')
                  setShowSignature(false)
                }}
                className="flex-1 px-6 py-3 bg-solar-success text-white rounded-lg font-semibold hover:bg-solar-success-dark transition-all"
              >
                Complete Agreement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Slide 1: Current Bill (Red/Scary)
function CurrentBillSlide() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Rising Every Year</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your Current Electric Bill
          </h2>
          <p className="text-xl text-slate-600">
            You're spending too much on electricity—and it's only going up.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-red-200">
          <div className="text-center">
            <div className="text-red-600 text-7xl md:text-8xl font-extrabold mb-4">
              ${MOCK_PROPOSAL.currentBill}
            </div>
            <div className="text-2xl text-slate-700 font-semibold mb-6">per month</div>
            <div className="text-lg text-slate-600">
              That's <span className="font-bold text-red-600">${MOCK_PROPOSAL.currentBill * 12}</span> per year
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-lg">
            Swipe right to see how solar changes this →
          </p>
        </div>
      </div>
    </div>
  )
}

// Slide 2: New Solar System
function NewSystemSlide() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-solar-secondary/10 px-4 py-2 rounded-full mb-6">
            <Sun className="w-5 h-5 text-solar-secondary" />
            <span className="text-sm font-semibold text-solar-secondary">Your Custom System</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your New Solar Roof
          </h2>
          <p className="text-xl text-slate-600">
            Premium solar panels designed specifically for your home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-solar-secondary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-solar-secondary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">{MOCK_PROPOSAL.systemSize} kW</div>
                <div className="text-sm text-slate-600">System Size</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              {MOCK_PROPOSAL.panelCount} premium solar panels on your roof
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-solar-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-solar-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">${MOCK_PROPOSAL.newBill}</div>
                <div className="text-sm text-slate-600">New Bill</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Small utility fee (save ${MOCK_PROPOSAL.monthlySavings}/month)
            </p>
          </div>
        </div>

        {/* 3D Visualization Placeholder */}
        <div className="bg-gradient-to-br from-solar-secondary to-solar-primary rounded-2xl p-12 text-white text-center shadow-xl">
          <Sun className="w-24 h-24 mx-auto mb-4 opacity-80" />
          <p className="text-lg font-semibold opacity-90">3D Roof Visualization</p>
          <p className="text-sm opacity-75 mt-2">Connect Aurora Solar API</p>
        </div>
      </div>
    </div>
  )
}

// Slide 3: Savings (Big Green Numbers)
function SavingsSlide() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-solar-success/10 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-5 h-5 text-solar-success" />
            <span className="text-sm font-semibold text-solar-success">Guaranteed Savings</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your Total Savings
          </h2>
          <p className="text-xl text-slate-600">
            Here's exactly how much you'll save over the next 25 years.
          </p>
        </div>

        {/* Hero Savings Number */}
        <div className="bg-gradient-to-br from-solar-success via-emerald-500 to-emerald-600 rounded-2xl p-12 text-white text-center shadow-2xl mb-8">
          <div className="text-6xl md:text-7xl font-extrabold mb-4">
            ${MOCK_PROPOSAL.savings25Year.toLocaleString()}
          </div>
          <div className="text-2xl font-semibold mb-2">Total 25-Year Savings</div>
          <div className="flex items-center justify-center gap-2 text-lg opacity-90">
            <CheckCircle className="w-6 h-6" />
            <span>Break-even in {MOCK_PROPOSAL.breakEvenYears} years</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-slate-200">
            <div className="text-3xl font-bold text-solar-success mb-2">
              ${MOCK_PROPOSAL.monthlySavings}
            </div>
            <div className="text-sm text-slate-600">Savings per month</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-slate-200">
            <div className="text-3xl font-bold text-solar-success mb-2">
              ${MOCK_PROPOSAL.yearOneSavings.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">First year savings</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-slate-200">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-solar-success mb-2">
              <Leaf className="w-8 h-8" />
              {MOCK_PROPOSAL.co2Offset}
            </div>
            <div className="text-sm text-slate-600">Tons CO₂ offset</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Slide 4: Sign Here
function SignatureSlide({ onShowSignature }: { onShowSignature: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Let's Make This Happen
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Lock in your savings today. No hidden fees, no surprises.
          </p>
        </div>

        {/* Investment Summary */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="text-left">
              <div className="text-sm text-slate-600 mb-1">System Cost</div>
              <div className="text-2xl font-bold text-slate-900">${MOCK_PROPOSAL.systemCost.toLocaleString()}</div>
            </div>
            <div className="text-left">
              <div className="text-sm text-slate-600 mb-1">Federal Tax Credit (30%)</div>
              <div className="text-2xl font-bold text-solar-success">-${MOCK_PROPOSAL.federalTaxCredit.toLocaleString()}</div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6">
            <div className="text-sm text-slate-600 mb-1">Your Net Investment</div>
            <div className="text-4xl font-extrabold text-solar-secondary">${MOCK_PROPOSAL.netCost.toLocaleString()}</div>
            <div className="text-sm text-slate-600 mt-2">Paid off in {MOCK_PROPOSAL.payoffMonths} months</div>
          </div>
        </div>

        {/* Sign Button with Arrow */}
        <div className="relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
            👇
          </div>
          <button
            onClick={onShowSignature}
            className="group w-full max-w-md mx-auto px-12 py-6 bg-gradient-to-r from-solar-success to-emerald-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-4"
          >
            Sign Here
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Secure digital signature • Instant approval
          </p>
        </div>
      </div>
    </div>
  )
}
