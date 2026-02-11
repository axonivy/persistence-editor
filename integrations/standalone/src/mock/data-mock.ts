import type { PersistenceData } from '@axonivy/persistence-editor-protocol';

export const data: PersistenceData[] = [
  {
    name: 'League Persistence Unit',
    description: 'Persistence unit for league data',
    dataSource: 'LeagueDB',
    excludeUnlistedClasses: false,
    managedClasses: ['com.example.league.Team', 'com.example.league.Player', 'com.example.league.Match'],
    properties: {
      'hibernate.hbm2ddl.auto': 'update'
    }
  },
  {
    name: 'Statistics Persistence Unit',
    description: 'Persistence unit for statistics data',
    dataSource: 'StatisticsDB',
    excludeUnlistedClasses: false,
    managedClasses: ['com.example.statistics.SeasonStats', 'com.example.statistics.PlayerStats'],
    properties: {
      'hibernate.hbm2ddl.auto': 'validate',
      'hibernate.show_sql': 'true'
    }
  },
  {
    name: 'Audit Persistence Unit',
    description: 'Persistence unit for audit logs',
    dataSource: 'AuditDB',
    excludeUnlistedClasses: true,
    managedClasses: ['com.example.audit.AuditLog'],
    properties: {
      'hibernate.hbm2ddl.auto': 'create',
      'hibernate.format_sql': 'true'
    }
  }
];
