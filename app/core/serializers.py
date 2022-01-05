from rest_framework.exceptions import ValidationError, ErrorDetail


def serializeErrorDetails(e: ErrorDetail):
    return [str(i) for i in e]


def serializeValidationError(e: ValidationError):
    result = {}
    for k,v in e.detail.items():
        result[k] = serializeValidationError(v) if type(v) == ValidationError else v
    return result

