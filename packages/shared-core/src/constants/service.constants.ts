export const SERVICE_NAMES = {
  CIAS: 'cias',
  HUB: 'hub',
  REPO: 'repo',
  COMMS: 'comms',
  BILLING: 'billing',
  SIEM: 'siem',
  GUARD: 'guard',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const HTTP_STATUS_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Invalid request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  INTERNAL_ERROR: 'Internal server error',
} as const;
