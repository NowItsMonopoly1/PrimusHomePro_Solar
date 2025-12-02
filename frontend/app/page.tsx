export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Sun, Zap, BarChart3, Users, Shield, Clock, CheckCircle2, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-solar-bg">
      {/* Navigation - Clean M.P.A. Style */}
      <nav className="bg-white sticky top-0 z-50 border-b border-solar-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-solar-primary rounded-xl flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-solar-gray-900">Primus<span className="text-solar-primary">Home</span>Pro</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-solar-gray-600 hover:text-solar-secondary font-medium transition-colors">Features</Link>
              <Link href="#pricing" className="text-solar-gray-600 hover:text-solar-secondary font-medium transition-colors">Pricing</Link>
              <Link href="/templates/simple" className="text-solar-gray-600 hover:text-solar-secondary font-medium transition-colors">Demo</Link>
            </div>
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="px-5 py-2.5 text-sm font-semibold text-solar-gray-700 hover:text-solar-secondary transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2.5 text-sm font-semibold text-white bg-solar-primary hover:bg-solar-primary-dark rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enterprise SaaS Product Hero */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-solar-secondary/10 border border-solar-secondary/20 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solar-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-solar-secondary"></span>
              </span>
              <span className="text-sm font-semibold text-solar-secondary">The AI Operating System for Home Pro Sales</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              The Ultimate Tool{' '}
              <span className="bg-gradient-to-r from-solar-primary via-solar-secondary to-solar-secondary bg-clip-text text-transparent">
                For Your Job
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Elite AI software platform for Road Warrior Sales Agents. Close deals in 5 minutes from your iPad with intelligent lead scoring, real-time proposals, and automated follow-ups.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignUpButton mode="modal">
                <button className="group px-8 py-4 text-lg font-bold text-white bg-solar-secondary hover:bg-solar-secondary-dark rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignUpButton>
              <Link href="/templates/simple">
                <button className="px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:border-solar-secondary hover:text-solar-secondary rounded-lg transition-all duration-200">
                  See Live Demo
                </button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-solar-success" />
                <span className="text-sm font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-solar-success" />
                <span className="text-sm font-medium">No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-solar-success" />
                <span className="text-sm font-medium">Used by 500+ agents</span>
              </div>
            </div>
          </div>
          
          {/* Product Screenshot - iPad Presentation Mode Mockup */}
          <div className="relative max-w-6xl mx-auto">
            {/* Floating UI Elements */}
            <div className="absolute -top-8 -left-8 bg-solar-success text-white px-4 py-2 rounded-lg shadow-xl text-sm font-semibold z-10 hidden lg:block">
              ✓ Deal Closed: $42,350
            </div>
            <div className="absolute -top-8 -right-8 bg-solar-secondary text-white px-4 py-2 rounded-lg shadow-xl text-sm font-semibold z-10 hidden lg:block animate-pulse">
              🔥 3 Hot Leads Nearby
            </div>
            
            {/* Main Product Mockup */}
            <div className="relative perspective-1000">
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* iPad Frame Simulation */}
                <div className="bg-white rounded-xl overflow-hidden shadow-inner">
                  {/* Header Bar */}
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-solar-secondary rounded-lg flex items-center justify-center">
                        <Sun className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg font-bold text-slate-900">Primus Home Pro</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 bg-solar-success/10 text-solar-success text-xs font-bold rounded-full">VIABLE</div>
                      <div className="px-3 py-1.5 bg-solar-secondary/10 text-solar-secondary text-xs font-bold rounded-full">8.5 kW</div>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6 space-y-4">
                    {/* Savings Hero */}
                    <div className="bg-gradient-to-br from-solar-success via-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                      <div className="text-sm font-semibold opacity-90 mb-1">25-Year Savings</div>
                      <div className="text-5xl font-extrabold mb-2">$67,420</div>
                      <div className="text-sm opacity-90">Break-even in 6.2 years ✓</div>
                    </div>
                    
                    {/* Status Cards Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-solar-secondary/10 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-solar-secondary" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">92</div>
                        <div className="text-xs text-slate-600">Lead Score</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-solar-primary/10 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-solar-primary" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">47</div>
                        <div className="text-xs text-slate-600">Proposals</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-solar-success/10 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-solar-success" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">23</div>
                        <div className="text-xs text-slate-600">Active Deals</div>
                      </div>
                    </div>
                    
                    {/* AI Activity Feed */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 bg-solar-primary/5 border-l-4 border-solar-primary rounded p-3">
                        <div className="text-xl">⚡</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">AI: Follow-up email sent</div>
                          <div className="text-xs text-slate-600">2 minutes ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 rounded p-3">
                        <div className="text-xl">📍</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">New lead: 0.3 mi from you</div>
                          <div className="text-xs text-slate-600">5 minutes ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge Bottom */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl border border-slate-200 z-10 whitespace-nowrap">
              <span className="text-sm font-semibold text-slate-700">Used on iPad, iPhone, and Desktop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - M.P.A. Clean */}
      <section className="bg-solar-bg border-y border-solar-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-solar-primary">2.5x</div>
              <div className="text-sm text-solar-gray-600 mt-1">More Conversions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-solar-secondary">500+</div>
              <div className="text-sm text-solar-gray-600 mt-1">Solar Contractors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-solar-success">$12M+</div>
              <div className="text-sm text-solar-gray-600 mt-1">Deals Closed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-solar-gray-900">98%</div>
              <div className="text-sm text-solar-gray-600 mt-1">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - M.P.A. Clean */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-solar-secondary/10 text-solar-secondary font-semibold rounded-full text-sm mb-4">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-solar-gray-900 mb-4">
              Everything You Need to <span className="text-solar-secondary">Dominate</span>
            </h2>
            <p className="text-lg text-solar-gray-600 max-w-2xl mx-auto">
              Built specifically for solar contractors who want to close more deals and grow faster.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="AI Lead Scoring"
              description="Instantly know which leads are ready to buy with our AI-powered scoring that analyzes 50+ data points."
              color="primary"
            />
            <FeatureCard
              icon={<Sun className="w-6 h-6" />}
              title="Google Solar API"
              description="Get instant solar viability assessments with satellite imagery analysis for any address."
              color="primary"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Smart Analytics"
              description="Track conversions, ROI, and pipeline health with real-time dashboards built for solar."
              color="secondary"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Team Management"
              description="Assign leads, track rep performance, and manage your entire sales team from one place."
              color="secondary"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Automation Engine"
              description="Set up powerful workflows that nurture leads, send follow-ups, and never let opportunities slip."
              color="success"
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Instant Proposals"
              description="Generate beautiful, branded solar proposals in seconds with AI-calculated savings."
              color="success"
            />
          </div>
        </div>
      </section>

      {/* Pricing - M.P.A. Clean */}
      <section id="pricing" className="bg-solar-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-solar-primary/10 text-solar-primary-dark font-semibold rounded-full text-sm mb-4">
              SIMPLE PRICING
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-solar-gray-900 mb-4">
              Invest in Your <span className="text-solar-primary">Growth</span>
            </h2>
            <p className="text-lg text-solar-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include success fees to align our success with yours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl border border-solar-gray-100 p-8 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-solar-gray-900 mb-2">Starter</h3>
                <p className="text-solar-gray-500 text-sm">For solo operators getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-solar-gray-900">$198</span>
                <span className="text-solar-gray-500">/month</span>
                <p className="text-sm text-solar-primary font-medium mt-2">+ $88 per closed deal</p>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>1 team seat included</PricingFeature>
                <PricingFeature>500 leads/month</PricingFeature>
                <PricingFeature>AI lead scoring</PricingFeature>
                <PricingFeature>Basic automations</PricingFeature>
                <PricingFeature>Email support</PricingFeature>
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full py-3 font-semibold text-solar-secondary border-2 border-solar-secondary rounded-lg hover:bg-solar-secondary hover:text-white transition-all duration-200">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>

            {/* Pro - Featured */}
            <div className="relative bg-white rounded-2xl border-2 border-solar-primary p-8 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-solar-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-solar-gray-900 mb-2">Pro</h3>
                <p className="text-solar-gray-500 text-sm">For growing solar businesses</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-solar-gray-900">$498</span>
                <span className="text-solar-gray-500">/month</span>
                <p className="text-sm text-solar-primary font-medium mt-2">+ $68 per closed deal</p>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>5 team seats included</PricingFeature>
                <PricingFeature>Unlimited leads</PricingFeature>
                <PricingFeature>Advanced AI features</PricingFeature>
                <PricingFeature>Unlimited automations</PricingFeature>
                <PricingFeature>Google Solar API access</PricingFeature>
                <PricingFeature>Priority support</PricingFeature>
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full py-3 font-semibold text-white bg-solar-primary hover:bg-solar-primary-dark rounded-lg shadow-sm transition-all duration-200">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>

            {/* Agency */}
            <div className="bg-white rounded-2xl border border-solar-gray-100 p-8 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-solar-gray-900 mb-2">Agency</h3>
                <p className="text-solar-gray-500 text-sm">For scaling enterprises</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-solar-gray-900">$1,198</span>
                <span className="text-solar-gray-500">/month</span>
                <p className="text-sm text-solar-primary font-medium mt-2">+ $48 per closed deal</p>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>10 team seats included</PricingFeature>
                <PricingFeature>Everything in Pro</PricingFeature>
                <PricingFeature>White-label options</PricingFeature>
                <PricingFeature>Custom integrations</PricingFeature>
                <PricingFeature>Dedicated success manager</PricingFeature>
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full py-3 font-semibold text-solar-secondary border-2 border-solar-secondary rounded-lg hover:bg-solar-secondary hover:text-white transition-all duration-200">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - M.P.A. Clean */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-solar-gray-900 mb-6">
            Ready to Supercharge Your Solar Sales?
          </h2>
          <p className="text-lg text-solar-gray-600 mb-10 max-w-2xl mx-auto">
            Join 500+ solar contractors who are closing more deals and growing faster with Primus Home Pro.
          </p>
          <SignUpButton mode="modal">
            <button className="group px-10 py-4 text-lg font-semibold text-white bg-solar-primary hover:bg-solar-primary-dark rounded-lg shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2">
              Start Your Free Trial Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignUpButton>
          <p className="mt-6 text-solar-gray-500 text-sm">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer - M.P.A. Clean */}
      <footer className="bg-solar-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-solar-primary rounded-xl flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Primus<span className="text-solar-primary">Home</span>Pro</span>
            </div>
            <div className="flex gap-8 text-solar-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-solar-gray-800 text-center text-solar-gray-500 text-sm">
            <p>&copy; 2025 Primus Home Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component - M.P.A. Style
function FeatureCard({ icon, title, description, color }: { 
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'secondary' | 'success'
}) {
  const colorClasses = {
    primary: 'bg-solar-primary text-white',
    secondary: 'bg-solar-secondary text-white',
    success: 'bg-solar-success text-white'
  }
  
  return (
    <div className="bg-solar-bg rounded-xl p-6 border border-solar-gray-100 hover:shadow-md transition-all duration-200">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-solar-gray-900 mb-2">{title}</h3>
      <p className="text-solar-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// Pricing Feature Component - M.P.A. Style
function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-solar-success" />
      <span className="text-solar-gray-600 text-sm">{children}</span>
    </li>
  )
}
