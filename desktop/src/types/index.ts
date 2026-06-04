export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'operator' | 'citizen'
}

export interface ServiceAccount {
  id: number
  account_number: string
  user_username: string
  service_name: string
  address: string
  status: 'active' | 'suspended' | 'cancelled'
}

export interface Invoice {
  id: number
  invoice_number: string
  account_number: string
  user_username: string
  service_name?: string
  period_start: string
  period_end: string
  amount: string
  tax: string
  total: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  status_display: string
  due_date: string
  payments: Payment[]
}

export interface Payment {
  id: number
  invoice: number
  amount: string
  method: 'cash' | 'card' | 'transfer' | 'online'
  method_display: string
  reference: string
  paid_at: string
}
