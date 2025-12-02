// PRIMUS HOME PRO - Map View (Turf/Canvassing Mode)
// For Road Warrior Sales Agents - Find High-Viability Leads on the Map

'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, Zap, Phone, DollarSign, TrendingUp, Filter, Target } from 'lucide-react'

// Mock lead data with GPS coordinates (In production, fetch from API)
const MOCK_MAP_LEADS = [
  {
    id: '1',
    name: 'John Smith',
    address: '123 Oak Street',
    lat: 40.7128,
    lng: -74.0060,
    suitability: 'VIABLE',
    systemSize: 8.5,
    leadScore: 92,
    distance: 0.3,
    estimatedSavings: 67420
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    address: '456 Maple Ave',
    lat: 40.7148,
    lng: -74.0080,
    suitability: 'VIABLE',
    systemSize: 10.2,
    leadScore: 87,
    distance: 0.5,
    estimatedSavings: 82150
  },
  {
    id: '3',
    name: 'Mike Davis',
    address: '789 Pine Road',
    lat: 40.7108,
    lng: -74.0040,
    suitability: 'CHALLENGING',
    systemSize: 5.8,
    leadScore: 65,
    distance: 0.7,
    estimatedSavings: 45200
  },
]

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedLead, setSelectedLead] = useState<typeof MOCK_MAP_LEADS[0] | null>(null)
  const [filterViableOnly, setFilterViableOnly] = useState(true)

  useEffect(() => {
    // Get user's GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Fallback to default location (NYC)
          setUserLocation({ lat: 40.7128, lng: -74.0060 })
        }
      )
    }
  }, [])

  const filteredLeads = filterViableOnly 
    ? MOCK_MAP_LEADS.filter(lead => lead.suitability === 'VIABLE')
    : MOCK_MAP_LEADS

  return (
    <div className="h-screen flex flex-col">
      {/* Map Header */}
      <div className="bg-white border-b border-slate-200 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-solar-secondary" />
              Turf View
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {filteredLeads.length} high-viability leads near you
            </p>
          </div>
          
          <button
            onClick={() => setFilterViableOnly(!filterViableOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterViableOnly
                ? 'bg-solar-secondary text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Viable Only
          </button>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-solar-success/10 rounded-lg p-3 border border-solar-success/20">
            <div className="text-2xl font-bold text-solar-success">{filteredLeads.length}</div>
            <div className="text-xs text-slate-600">Nearby Leads</div>
          </div>
          <div className="bg-solar-secondary/10 rounded-lg p-3 border border-solar-secondary/20">
            <div className="text-2xl font-bold text-solar-secondary">
              {(filteredLeads.reduce((sum, l) => sum + l.leadScore, 0) / filteredLeads.length).toFixed(0)}
            </div>
            <div className="text-xs text-slate-600">Avg Score</div>
          </div>
          <div className="bg-solar-primary/10 rounded-lg p-3 border border-solar-primary/20">
            <div className="text-2xl font-bold text-solar-primary">
              ${(filteredLeads.reduce((sum, l) => sum + l.estimatedSavings, 0) / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-slate-600">Total Value</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-slate-100">
        {/* Placeholder Map - Replace with Google Maps/Mapbox in production */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">Map Integration</p>
            <p className="text-sm text-slate-500 mt-1">Connect Google Maps API</p>
          </div>
        </div>

        {/* Lead Pins Overlay (Simulated) */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredLeads.map((lead, index) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="absolute pointer-events-auto"
              style={{
                left: `${30 + index * 20}%`,
                top: `${40 + index * 10}%`,
              }}
            >
              <div className={`relative transform hover:scale-110 transition-transform ${
                selectedLead?.id === lead.id ? 'scale-125 z-10' : ''
              }`}>
                <div className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${
                  lead.suitability === 'VIABLE'
                    ? 'bg-solar-success text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  <span className="text-lg font-bold">{lead.leadScore}</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-inherit rotate-45"></div>
              </div>
            </button>
          ))}
        </div>

        {/* User Location Pin */}
        {userLocation && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative">
              <div className="w-16 h-16 bg-solar-secondary rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-solar-secondary rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="mt-2 text-center">
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-solar-secondary shadow-lg">
                You Are Here
              </span>
            </div>
          </div>
        )}

        {/* Recenter Button */}
        <button
          className="absolute bottom-24 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
          onClick={() => {
            // In production: recenter map to user location
            alert('Recentering to your location...')
          }}
        >
          <Navigation className="w-5 h-5 text-solar-secondary" />
        </button>
      </div>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="absolute bottom-16 lg:bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 p-6 animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-900">{selectedLead.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  selectedLead.suitability === 'VIABLE'
                    ? 'bg-solar-success/10 text-solar-success'
                    : 'bg-amber-500/10 text-amber-700'
                }`}>
                  {selectedLead.suitability}
                </span>
              </div>
              <p className="text-sm text-slate-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {selectedLead.address} • {selectedLead.distance} mi away
              </p>
            </div>
            <button
              onClick={() => setSelectedLead(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <Zap className="w-5 h-5 text-solar-secondary mx-auto mb-1" />
              <div className="text-lg font-bold text-slate-900">{selectedLead.leadScore}</div>
              <div className="text-xs text-slate-600">Score</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <TrendingUp className="w-5 h-5 text-solar-primary mx-auto mb-1" />
              <div className="text-lg font-bold text-slate-900">{selectedLead.systemSize} kW</div>
              <div className="text-xs text-slate-600">System</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <DollarSign className="w-5 h-5 text-solar-success mx-auto mb-1" />
              <div className="text-lg font-bold text-slate-900">${(selectedLead.estimatedSavings / 1000).toFixed(0)}k</div>
              <div className="text-xs text-slate-600">Savings</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${selectedLead.id}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-solar-secondary text-white rounded-lg font-semibold hover:bg-solar-secondary-dark transition-all"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href={`https://maps.google.com/?q=${selectedLead.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
