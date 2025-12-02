export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Sun, Zap, BarChart3, Users, Shield, Clock, CheckCircle2, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-solar-bg">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-solar-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 solar-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Sun className="w-6 h-6 text-solar-gray-900" />
              </div>
              <span className="text-2xl font-bold text-solar-secondary">Primus<span className="text-solar-primary">Solar</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-solar-gray-600 hover:text-solar-secondary font-medium transition-colors">Features</Link>
              <Link href="#pricing" className="text-solar-gray-600 hover:text-solar-secondary font-medium transition-colors">Pricing</Link>
              <Link href="/templates/simple" className="text-solar-gray-600 hover:text-solar-secondary font-medium transition-colors">Demo</Link>
            </div>
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="px-5 py-2.5 text-sm font-semibold text-solar-secondary hover:text-solar-secondary-dark transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2.5 text-sm font-bold text-solar-gray-900 bg-solar-primary hover:bg-solar-primary-dark rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-solar-secondary via-solar-secondary-dark to-solar-secondary-dark"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-solar-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-solar-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <Star className="w-4 h-4 text-solar-primary fill-solar-primary" />
              <span className="text-sm font-medium text-white">Trusted by 500+ Solar Contractors</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Close More Solar Deals with{' '}
              <span className="solar-gradient-text">AI-Powered</span> CRM
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Capture leads, automate follow-ups, and boost conversions with intelligent solar-specific tools built for contractors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignUpButton mode="modal">
                <button className="group w-full sm:w-auto px-8 py-4 text-lg font-bold text-solar-gray-900 solar-gradient rounded-xl shadow-xl hover:shadow-2xl solar-glow transition-all duration-300 flex items-center justify-center gap-2">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignUpButton>
              <Link href="/templates/simple" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-200">
                  Watch Demo
                </button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-solar-success" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-solar-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-solar-success" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-solar-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-solar-secondary">2.5x</div>
              <div className="text-sm text-solar-gray-600 font-medium">More Conversions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-solar-secondary">500+</div>
              <div className="text-sm text-solar-gray-600 font-medium">Solar Contractors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-solar-secondary">$12M+</div>
              <div className="text-sm text-solar-gray-600 font-medium">Deals Closed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-solar-secondary">98%</div>
              <div className="text-sm text-solar-gray-600 font-medium">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-solar-primary/10 text-solar-primary-dark font-semibold rounded-full text-sm mb-4">
            POWERFUL FEATURES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-solar-gray-900 mb-4">
            Everything You Need to <span className="text-solar-secondary">Dominate</span>
          </h2>
          <p className="text-xl text-solar-gray-600 max-w-2xl mx-auto">
            Built specifically for solar contractors who want to close more deals and grow faster.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-7 h-7" />}
            title="AI Lead Scoring"
            description="Instantly know which leads are ready to buy with our AI-powered scoring that analyzes 50+ data points."
            gradient="from-amber-400 to-orange-500"
          />
          <FeatureCard
            icon={<Sun className="w-7 h-7" />}
            title="Google Solar API"
            description="Get instant solar viability assessments with satellite imagery analysis for any address."
            gradient="from-solar-primary to-yellow-500"
          />
          <FeatureCard
            icon={<BarChart3 className="w-7 h-7" />}
            title="Smart Analytics"
            description="Track conversions, ROI, and pipeline health with real-time dashboards built for solar."
            gradient="from-blue-400 to-solar-secondary"
          />
          <FeatureCard
            icon={<Users className="w-7 h-7" />}
            title="Team Management"
            description="Assign leads, track rep performance, and manage your entire sales team from one place."
            gradient="from-purple-400 to-purple-600"
          />
          <FeatureCard
            icon={<Shield className="w-7 h-7" />}
            title="Automation Engine"
            description="Set up powerful workflows that nurture leads, send follow-ups, and never let opportunities slip."
            gradient="from-emerald-400 to-solar-success"
          />
          <FeatureCard
            icon={<Clock className="w-7 h-7" />}
            title="Instant Proposals"
            description="Generate beautiful, branded solar proposals in seconds with AI-calculated savings."
            gradient="from-pink-400 to-rose-500"
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-solar-secondary/10 text-solar-secondary font-semibold rounded-full text-sm mb-4">
              SIMPLE PRICING
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-solar-gray-900 mb-4">
              Invest in Your <span className="text-solar-primary">Growth</span>
            </h2>
            <p className="text-xl text-solar-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include success fees to align our success with yours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl border-2 border-solar-gray-200 p-8 hover:border-solar-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-solar-gray-900 mb-2">Starter</h3>
                <p className="text-solar-gray-600">For solo operators getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-solar-gray-900">$198</span>
                <span className="text-solar-gray-600">/month</span>
                <p className="text-sm text-solar-primary-dark font-semibold mt-2">+ $88 per closed deal</p>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature>1 team seat included</PricingFeature>
                <PricingFeature>500 leads/month</PricingFeature>
                <PricingFeature>AI lead scoring</PricingFeature>
                <PricingFeature>Basic automations</PricingFeature>
                <PricingFeature>Email support</PricingFeature>
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full py-3.5 font-bold text-solar-secondary border-2 border-solar-secondary rounded-xl hover:bg-solar-secondary hover:text-white transition-all duration-200">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>

            {/* Pro - Featured */}
            <div className="relative bg-gradient-to-br from-solar-secondary to-solar-secondary-dark rounded-2xl p-8 text-white shadow-2xl scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-solar-primary text-solar-gray-900 px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-white/70">For growing solar businesses</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black">$498</span>
                <span className="text-white/70">/month</span>
                <p className="text-sm text-solar-primary font-semibold mt-2">+ $68 per closed deal</p>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature light>5 team seats included</PricingFeature>
                <PricingFeature light>Unlimited leads</PricingFeature>
                <PricingFeature light>Advanced AI features</PricingFeature>
                <PricingFeature light>Unlimited automations</PricingFeature>
                <PricingFeature light>Google Solar API access</PricingFeature>
                <PricingFeature light>Priority support</PricingFeature>
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full py-3.5 font-bold text-solar-gray-900 solar-gradient rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>

            {/* Agency */}
            <div className="bg-white rounded-2xl border-2 border-solar-gray-200 p-8 hover:border-solar-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-solar-gray-900 mb-2">Agency</h3>
                <p className="text-solar-gray-600">For scaling enterprises</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-solar-gray-900">$1,198</span>
                <span className="text-solar-gray-600">/month</span>
                <p className="text-sm text-solar-primary-dark font-semibold mt-2">+ $48 per closed deal</p>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature>10 team seats included</PricingFeature>
                <PricingFeature>Everything in Pro</PricingFeature>
                <PricingFeature>White-label options</PricingFeature>
                <PricingFeature>Custom integrations</PricingFeature>
                <PricingFeature>Dedicated success manager</PricingFeature>
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full py-3.5 font-bold text-solar-secondary border-2 border-solar-secondary rounded-xl hover:bg-solar-secondary hover:text-white transition-all duration-200">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 solar-gradient"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-black text-solar-gray-900 mb-6">
            Ready to Supercharge Your Solar Sales?
          </h2>
          <p className="text-xl text-solar-gray-800 mb-10 max-w-2xl mx-auto">
            Join 500+ solar contractors who are closing more deals and growing faster with Primus Solar.
          </p>
          <SignUpButton mode="modal">
            <button className="group px-10 py-5 text-xl font-bold text-white bg-solar-secondary hover:bg-solar-secondary-dark rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto">
              Start Your Free Trial Today
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignUpButton>
          <p className="mt-6 text-solar-gray-700 font-medium">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-solar-secondary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 solar-gradient rounded-xl flex items-center justify-center">
                <Sun className="w-6 h-6 text-solar-gray-900" />
              </div>
              <span className="text-2xl font-bold">Primus<span className="text-solar-primary">Solar</span></span>
            </div>
            <div className="flex gap-8 text-white/70">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50">
            <p>&copy; 2025 Primus Solar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description, gradient }: { 
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="group bg-white rounded-2xl p-8 border border-solar-gray-200 hover:border-solar-primary/30 hover:shadow-xl transition-all duration-300">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-solar-gray-900 mb-3">{title}</h3>
      <p className="text-solar-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

// Pricing Feature Component
function PricingFeature({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${light ? 'text-solar-primary' : 'text-solar-success'}`} />
      <span className={light ? 'text-white/90' : 'text-solar-gray-700'}>{children}</span>
    </li>
  )
}
