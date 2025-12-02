'use client'

// PRIMUS HOME PRO - Leads Table Component
// Interactive data grid with solar-branded styling

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import type { LeadWithMeta } from '@/types'
import { LeadDrawer } from './lead-drawer'
import { ScoreBadge, IntentBadge, StageBadge, SolarBadge } from './badges'
import { User, Mail, Phone, MapPin, Calendar, ExternalLink } from 'lucide-react'

interface LeadsTableProps {
  initialLeads: LeadWithMeta[]
}

export function LeadsTable({ initialLeads }: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<LeadWithMeta | null>(null)

  const columns: ColumnDef<LeadWithMeta>[] = [
    {
      header: 'Lead',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-solar-secondary to-solar-secondary-dark rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {(row.original.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-solar-gray-900">
              {row.original.name || 'Anonymous Lead'}
            </p>
            <p className="text-xs text-solar-gray-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {row.original.email || 'No email'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Score',
      accessorKey: 'lastScore',
      cell: ({ row }) => <ScoreBadge score={row.original.lastScore || 0} />,
    },
    {
      header: 'Intent',
      accessorKey: 'lastIntent',
      cell: ({ row }) => (
        <IntentBadge intent={row.original.lastIntent || 'New'} />
      ),
    },
    {
      header: 'Stage',
      accessorKey: 'stage',
      cell: ({ row }) => <StageBadge stage={row.original.stage} />,
    },
    {
      header: 'Solar Status',
      accessorKey: 'siteSuitability',
      cell: ({ row }) => {
        const lead = row.original as LeadWithMeta & { siteSuitability?: string; solarEnriched?: boolean }
        if (!lead.solarEnriched) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-solar-gray-100 text-solar-gray-500 text-xs font-medium rounded-lg">
              Pending Analysis
            </span>
          )
        }
        return <SolarBadge suitability={lead.siteSuitability || 'NOT_VIABLE'} />
      },
    },
    {
      header: 'Source',
      accessorKey: 'source',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-solar-secondary/10 text-solar-secondary text-xs font-semibold rounded-lg">
          {row.original.source}
        </span>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm text-solar-gray-600">
          <Calendar className="w-4 h-4 text-solar-gray-400" />
          {new Date(row.original.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      ),
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedLead(row.original)
          }}
          className="p-2 text-solar-gray-400 hover:text-solar-secondary hover:bg-solar-secondary/10 rounded-lg transition-colors"
          aria-label="View lead details"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      ),
    },
  ]

  const table = useReactTable({
    data: initialLeads,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <div className="overflow-hidden rounded-2xl border-2 border-solar-gray-200 bg-white solar-card-shadow-lg">
        <table className="w-full text-left">
          <thead className="border-b-2 border-solar-gray-100 bg-solar-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-solar-gray-600">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-solar-gray-100">
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-solar-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-solar-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-solar-gray-700">No leads yet</h3>
                    <p className="text-solar-gray-500 max-w-sm">
                      Capture your first lead from a landing page or add one manually to get started.
                    </p>
                  </div>
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelectedLead(row.original)}
                className="cursor-pointer transition-all duration-200 hover:bg-solar-primary/5 group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </>
  )
}
