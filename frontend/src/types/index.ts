export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'operator' | 'citizen'
  phone: string
  is_active: boolean
}

export interface ServiceCategory {
  id: number
  name: string
  description: string
  is_active: boolean
  created_at: string
}

export interface Service {
  id: number
  category: number
  category_name: string
  name: string
  description: string
  base_rate: string
  unit: string
  is_active: boolean
  created_at: string
}

export interface ServiceAccount {
  id: number
  user: number
  user_username: string
  service: number
  service_name: string
  account_number: string
  address: string
  status: 'active' | 'suspended' | 'cancelled'
  created_at: string
}

export interface Invoice {
  id: number
  service_account: number
  account_number: string
  user_username: string
  invoice_number: string
  period_start: string
  period_end: string
  amount: string
  tax: string
  total: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  status_display: string
  due_date: string
  issued_at: string
  payments: Payment[]
  created_at: string
}

export interface Payment {
  id: number
  invoice: number
  amount: string
  method: 'cash' | 'card' | 'transfer' | 'online'
  method_display: string
  reference: string
  paid_at: string
  created_at: string
}

export interface DashboardSummary {
  users: {
    total: number
    citizens: number
    operators: number
  }
  services: {
    total_accounts: number
    active_accounts: number
    suspended_accounts: number
  }
  invoices: {
    total: number
    pending: number
    paid: number
    overdue: number
    pending_amount: number
    overdue_amount: number
  }
  payments: {
    total_this_month: number
    count_this_month: number
  }
}

export interface AuthTokens {
  access: string
  refresh: string
}
