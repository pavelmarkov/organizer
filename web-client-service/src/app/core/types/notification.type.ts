export enum NotificationSeverityEnum {
  SUCCESS = 'success',
  INFO = 'info',
  WARN = 'warn',
  DANGER = 'danger',
  SECONDARY = 'secondary',
  CONTRAST = 'contrast',
}

export interface NotificationType {
  severity: NotificationSeverityEnum;
  summary: string;
  detail: string;
  life?: number;
}
