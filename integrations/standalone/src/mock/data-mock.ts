import type { PersistenceData } from '@axonivy/persistence-editor-protocol';

export const data: PersistenceData[] = [
  {
    id: 'league',
    name: 'League Persistence Unit',
    dataSource: 'LeagueDB',
    excludeUnlistedClasses: false,
    managedClasses: [
      'com.example.league.Team',
      'com.example.league.Player',
      'com.example.league.Match'
    ],
    properties: {
      'hibernate.hbm2ddl.auto': ['update']
    }
  },
  {
    id: 'statistics',
    name: 'Statistics Persistence Unit',
    dataSource: 'StatisticsDB',
    excludeUnlistedClasses: false,
    managedClasses: [
      'com.example.statistics.SeasonStats',
      'com.example.statistics.PlayerStats'
    ],
    properties: {
      'hibernate.hbm2ddl.auto': ['validate'],
      'hibernate.show_sql': ['true']
    }
  },
  {
    id: 'audit',
    name: 'Audit Persistence Unit',
    dataSource: 'AuditDB',
    excludeUnlistedClasses: true,
    managedClasses: [
      'com.example.audit.AuditLog'
    ],
    properties: {
      'hibernate.hbm2ddl.auto': ['create'],
      'hibernate.format_sql': ['true']
    }
  }
];
