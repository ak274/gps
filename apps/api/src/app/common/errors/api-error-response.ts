export interface ApiValidationIssue {
  field: string;
  message: string;
  rule?: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: ApiValidationIssue[] | Record<string, unknown>;
}

export interface ApiErrorResponse {
  statusCode: number;
  path: string;
  method: string;
  timestamp: string;
  requestId?: string;
  error: ApiErrorBody;
}
