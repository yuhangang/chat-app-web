import { RequestError } from "@/types";

export type { RequestError };

export const RequestErrors: { [key: string]: RequestError } = {
  timeout_error: {
    message: "The request timed out. Please try again later.",
    code: 408,
    type: "timeout",
  },
  socket_error: {
    message: "A socket error occurred. Please check your network connection.",
    code: 500,
    type: "network",
  },
  no_connection: {
    message: "No internet connection. Please check your network and try again.",
    code: 0,
    type: "network",
  },
  network_error: {
    message: "A network error occurred. Please try again.",
    code: 503,
    type: "network",
  },
  server_error: {
    message: "An internal server error occurred. Please try again later.",
    code: 500,
    type: "server",
  },
  not_found: {
    message: "The requested resource was not found.",
    code: 404,
    type: "client",
  },
  forbidden: {
    message: "You don't have permission to access this resource.",
    code: 403,
    type: "client",
  },
  unauthorized: {
    message: "You need to be authorized to access this resource.",
    code: 401,
    type: "client",
  },
  client_error: {
    message: "A client-side error occurred. Please check your request.",
    code: 400,
    type: "client",
  },
  redirect: {
    message:
      "The resource has been redirected. Please follow the new location.",
    code: 300,
    type: "redirection",
  },
  success: {
    message: "The request was successful.",
    code: 200,
    type: "success",
  },
  informational: {
    message: "This is an informational response.",
    code: 100,
    type: "informational",
  },
  unknown_error: {
    message: "An unknown error occurred.",
    code: 0,
    type: "unknown",
  },
};

export function getErrorType(
  status: number,
  statusText?: string
): RequestError {
  if (statusText) {
    const normalizedStatusText = statusText.toLowerCase();

    if (normalizedStatusText.includes("timeout")) {
      return RequestErrors.timeout_error;
    } else if (normalizedStatusText.includes("socket")) {
      return RequestErrors.socket_error;
    } else if (
      normalizedStatusText.includes("networkerror") ||
      normalizedStatusText.includes("failed to fetch") ||
      normalizedStatusText.includes("dns")
    ) {
      return RequestErrors.no_connection;
    }
    return RequestErrors.network_error;
  }

  switch (true) {
    case status >= 500:
      return RequestErrors.server_error;
    case status === 404:
      return RequestErrors.not_found;
    case status === 403:
      return RequestErrors.forbidden;
    case status === 401:
      return RequestErrors.unauthorized;
    case status >= 400:
      return RequestErrors.client_error;
    case status >= 300:
      return RequestErrors.redirect;
    case status >= 200:
      return RequestErrors.success;
    case status >= 100:
      return RequestErrors.informational;
    default:
      return RequestErrors.unknown_error;
  }
}
