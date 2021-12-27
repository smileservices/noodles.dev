from rest_framework.exceptions import ValidationError, ErrorDetail


def serializeErrorDetails(e: ErrorDetail):
    return [str(i) for i in e]


def serializeValidationError(e: ValidationError):
    return {k: serializeErrorDetails(v) for k, v in e.detail.items()}

