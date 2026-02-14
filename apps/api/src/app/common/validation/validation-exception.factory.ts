import { BadRequestException, ValidationError } from '@nestjs/common';
import { ApiValidationIssue } from '../errors/api-error-response';

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ApiValidationIssue[] {
  return errors.flatMap((error) => {
    const currentField = parentPath ? `${parentPath}.${error.property}` : error.property;

    const currentIssues = error.constraints
      ? Object.entries(error.constraints).map(([rule, message]) => ({
          field: currentField,
          rule,
          message,
        }))
      : [];

    const childIssues = error.children?.length
      ? flattenValidationErrors(error.children, currentField)
      : [];

    return [...currentIssues, ...childIssues];
  });
}

export function validationExceptionFactory(errors: ValidationError[]) {
  const details = flattenValidationErrors(errors);

  return new BadRequestException({
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details,
  });
}
