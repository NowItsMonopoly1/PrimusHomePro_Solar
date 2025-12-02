// DOMAIN: Leads - Create Lead From Form
// Pure business logic - no external dependencies

export interface LeadFormInput {
  name: string;
  email: string | null;
  phone: string | null;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  source?: string;
}

export interface Lead {
  id: string;
  agentId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  status: 'new' | 'qualified' | 'contacted' | 'proposal_sent' | 'closed' | 'lost';
  createdAt: Date;
}

/**
 * Create a lead from form input
 * 
 * This is a STUB - implementation will call DB via service layer
 * Domain logic: validate input, normalize data, assign status
 */
export async function createLeadFromForm(input: LeadFormInput): Promise<Lead> {
  // TODO: Implement via service layer (packages/services/database)
  // For now, return stub shape so agents can work
  
  const fullAddress = `${input.addressLine1}, ${input.city}, ${input.state} ${input.zip}`;
  
  return {
    id: `lead_${Date.now()}`, // Stub ID
    agentId: null,
    name: input.name,
    email: input.email,
    phone: input.phone,
    address: fullAddress,
    status: 'new',
    createdAt: new Date(),
  };
}
