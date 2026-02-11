import type { ManagedClassesMeta } from '@axonivy/persistence-editor-protocol';

export const MANAGED_CLASSES: Array<ManagedClassesMeta> = [
  { id: 'com.example.hr.Employee', label: 'Employee (HR)' },
  { id: 'com.example.hr.TeamLead', label: 'Team Lead (HR)' },
  { id: 'com.example.hr.Manager', label: 'Manager (HR)' },
  { id: 'com.example.finance.Invoice', label: 'Invoice (Finance)' },
  { id: 'com.example.finance.Payment', label: 'Payment (Finance)' },
  { id: 'com.example.ops.Delivery', label: 'Delivery (Operations)' },
  { id: 'com.example.ops.Order', label: 'Order (Operations)' },
  { id: 'com.example.ops.Shipment', label: 'Shipment (Operations)' },
  { id: 'com.example.crm.Customer', label: 'Customer (CRM)' },
  { id: 'com.example.crm.Lead', label: 'Lead (CRM)' },
  { id: 'com.example.security.AuditLog', label: 'Audit Log (Security)' },
  { id: 'com.example.shared.Attachment', label: 'Attachment (Shared)' }
];

export const DATASOURCES: Array<string> = ['LeagueDB', 'StatisticsDB', 'AuditDB', 'FinanceDB', 'WarehouseDB', 'AnalyticsDB'];
