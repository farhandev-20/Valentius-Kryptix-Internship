from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first to get the standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "success": False,
            "status_code": response.status_code,
            "message": "An error occurred",
            "errors": {}
        }

        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            custom_data["message"] = "Authentication credentials were not provided or are invalid."
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            custom_data["message"] = "You do not have permission to perform this action."
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            custom_data["message"] = "The requested resource was not found."
        elif response.status_code == status.HTTP_400_BAD_REQUEST:
            custom_data["message"] = "Input validation failed. Please check the submitted fields."

        # Handle details and field errors
        if isinstance(response.data, dict):
            if "detail" in response.data:
                custom_data["message"] = str(response.data["detail"])
                custom_data["errors"] = {"detail": [str(response.data["detail"])]}
            else:
                custom_data["errors"] = response.data
        elif isinstance(response.data, list):
            custom_data["errors"] = {"non_field_errors": response.data}
        else:
            custom_data["errors"] = {"error": str(response.data)}

        response.data = custom_data

    return response
