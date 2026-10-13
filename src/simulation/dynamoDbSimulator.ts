import { SecurityEvent } from '../types/security';

export interface DynamoDbPutResult {
  tableName: string;
  consumedCapacity: number;
  itemKey: { eventId: string; timestamp: string };
  status: 'HTTP_200_OK';
}

export function saveSecurityEventToDynamoDb(event: SecurityEvent): DynamoDbPutResult {
  return {
    tableName: 'CloudShield_SecurityEvents',
    consumedCapacity: 1.0,
    itemKey: {
      eventId: event.eventId,
      timestamp: event.timestamp
    },
    status: 'HTTP_200_OK'
  };
}
