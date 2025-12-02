// DOMAIN: Agent Types

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'sales_agent' | 'scheduler' | 'installer';
}
