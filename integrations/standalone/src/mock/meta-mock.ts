import type { DataclassType, JavaType } from '@axonivy/persistence-editor-protocol';
export const IVY_CLASSES: Array<JavaType> = [
  {
    fullQualifiedName: 'java.lang.String',
    packageName: 'java.lang',
    simpleName: 'String'
  },
  {
    fullQualifiedName: 'java.lang.Boolean',
    packageName: 'java.lang',
    simpleName: 'Boolean'
  },
  {
    fullQualifiedName: 'java.lang.Integer',
    packageName: 'java.lang',
    simpleName: 'Integer'
  }
];

export const OWN_TYPES: Array<JavaType> = [
  {
    fullQualifiedName: 'com.acme.bank.loan.CreditAssessment',
    packageName: 'com.acme.bank.loan',
    simpleName: 'CreditAssessment'
  },
  {
    fullQualifiedName: 'com.acme.bank.shared.Document',
    packageName: 'com.acme.bank.shared',
    simpleName: 'Document'
  }
];

export const ALL_TYPES: Array<JavaType> = [
  {
    fullQualifiedName: 'com.acme.bank.integration.corebanking.CoreLoanDto',
    packageName: 'com.acme.bank.integration.corebanking',
    simpleName: 'CoreLoanDto'
  },
  {
    fullQualifiedName: 'com.acme.bank.integration.dwh.LoanAnalyticsDto',
    packageName: 'com.acme.bank.integration.dwh',
    simpleName: 'LoanAnalyticsDto'
  }
];

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
