// audit-trail.model.ts

export interface AuditTrail {
    userId: string;
    userName: string;
    timestamp: Date;
    actionType: string;
    details: string;
    success: boolean;
    page: string;
    errorMessage?: string;
  }