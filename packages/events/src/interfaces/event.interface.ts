export interface EventMessage<T = any> {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  data: T;
  metadata?: Record<string, any>;
}

export interface PulsarConfig {
  serviceUrl: string;
  operationTimeoutSeconds?: number;
  ioThreads?: number;
  messageListenerThreads?: number;
}

export interface ProducerConfig {
  topic: string;
  producerName?: string;
  sendTimeoutMs?: number;
  batchingEnabled?: boolean;
  batchingMaxPublishDelayMs?: number;
  batchingMaxMessages?: number;
}

export interface ConsumerConfig {
  topic: string | string[];
  subscription: string;
  subscriptionType?: 'Exclusive' | 'Shared' | 'Failover' | 'KeyShared';
  subscriptionInitialPosition?: 'Latest' | 'Earliest';
  ackTimeoutMs?: number;
  nAckRedeliverTimeoutMs?: number;
  receiverQueueSize?: number;
}

export interface EventHandler<T = any> {
  (message: EventMessage<T>): Promise<void>;
}

export const EVENT_TOPICS = {
  // User events
  USER_CREATED: 'juris.user.created',
  USER_UPDATED: 'juris.user.updated',
  USER_DELETED: 'juris.user.deleted',
  
  // Auth events
  USER_LOGIN: 'juris.auth.login',
  USER_LOGOUT: 'juris.auth.logout',
  PASSWORD_CHANGED: 'juris.auth.password-changed',
  TWO_FACTOR_ENABLED: 'juris.auth.2fa-enabled',
  
  // Document events
  DOCUMENT_CREATED: 'juris.document.created',
  DOCUMENT_UPDATED: 'juris.document.updated',
  DOCUMENT_DELETED: 'juris.document.deleted',
  DOCUMENT_SHARED: 'juris.document.shared',
  
  // Case/Matter events
  CASE_CREATED: 'juris.case.created',
  CASE_UPDATED: 'juris.case.updated',
  CASE_CLOSED: 'juris.case.closed',
  
  // Billing events
  INVOICE_CREATED: 'juris.billing.invoice-created',
  PAYMENT_RECEIVED: 'juris.billing.payment-received',
  PAYMENT_FAILED: 'juris.billing.payment-failed',
  
  // Communication events
  EMAIL_SENT: 'juris.comms.email-sent',
  NOTIFICATION_SENT: 'juris.comms.notification-sent',
  
  // Audit events
  ACTIVITY_LOGGED: 'juris.audit.activity-logged',
  COMPLIANCE_ALERT: 'juris.audit.compliance-alert',
} as const;

export type EventTopic = typeof EVENT_TOPICS[keyof typeof EVENT_TOPICS];
