import type { DataclassType } from '@axonivy/persistence-editor-protocol';

export const DATACLASSES: Array<DataclassType> = [
  {
    fullQualifiedName: 'com.acme.bank.loan.LoanApplication',
    name: 'LoanApplication',
    packageName: 'com.acme.bank.loan',
    path: '/dataclasses/loan/LoanApplication.ivy'
  },
  {
    fullQualifiedName: 'com.acme.bank.payment.Payment',
    name: 'Payment',
    packageName: 'com.acme.bank.payment',
    path: '/dataclasses/payment/Payment.ivy'
  }
];

export const DATASOURCES: Array<string> = ['LeagueDB', 'StatisticsDB', 'AuditDB', 'FinanceDB', 'WarehouseDB', 'AnalyticsDB'];
