import type { DataclassType, PersistencePropertyMeta } from '@axonivy/persistence-editor-protocol';

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

export const PROPERTIES: Array<PersistencePropertyMeta> = [
  {
    property: 'hibernate.hbm2ddl.auto',
    defaultValue: 'update',
    description: 'Controls the Hibernate database schema generation process',
    examples: ['validate', 'update', 'create', 'create-drop']
  },
  {
    property: 'hibernate.dialect',
    defaultValue: '',
    description: 'Specifies the SQL dialect that Hibernate should use when communicating with the database.',
    examples: ['org.hibernate.dialect.PostgreSQLDialect', 'org.hibernate.dialect.MySQLDialect']
  }
];

export const DATASOURCES: Array<string> = ['LeagueDB', 'StatisticsDB', 'AuditDB', 'FinanceDB', 'WarehouseDB', 'AnalyticsDB'];
