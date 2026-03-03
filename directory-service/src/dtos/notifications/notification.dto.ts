export enum NotificationSeverityEnum {
  SUCCESS = "success",
  INFO = "info",
  WARN = "warn",
  DANGER = "danger",
  SECONDARY = "secondary",
  CONTRAST = "contrast",
}

export class NotificationDto {
  severity: NotificationSeverityEnum;
  summary: string;
  detail: string;
}
