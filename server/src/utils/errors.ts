import { TRPCError } from "@trpc/server";

// Define Prisma error interface to avoid importing from @prisma/client
interface PrismaError extends Error {
  code: string;
  clientVersion: string;
}

/**
 * Type guard to check if error is a Prisma known request error
 */
const isPrismaError = (error: unknown): error is PrismaError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "clientVersion" in error &&
    typeof (error as PrismaError).code === "string"
  );
};

/**
 * Handles Prisma errors and converts them to appropriate tRPC errors
 * @param error The error to handle
 * @param resourceName Name of the resource for error messages (e.g., "Document", "Rule category")
 * @throws TRPCError with appropriate code and message
 */
export const handlePrismaError = (error: unknown, resourceName: string): never => {
  if (isPrismaError(error)) {
    switch (error.code) {
      case "P2025": // Record not found
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `${resourceName} not found`,
        });
      case "P2003": // Foreign key constraint failed
        throw new TRPCError({
          code: "CONFLICT",
          message: `Cannot delete ${resourceName.toLowerCase()}: it has dependent records`,
        });
      case "P2002": // Unique constraint failed
        throw new TRPCError({
          code: "CONFLICT",
          message: `${resourceName} with this value already exists`,
        });
      default:
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Database error: ${error.message}`,
          cause: error,
        });
    }
  }

  // Re-throw if not a Prisma error
  throw error;
};

/**
 * Wraps a service function with error handling
 * @param fn The service function to wrap
 * @param resourceName Name of the resource for error messages
 * @returns The wrapped function with automatic error handling
 */
export const withErrorHandling = <TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  resourceName: string
): ((...args: TArgs) => Promise<TReturn>) => {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await fn(...args);
    } catch (error) {
      // handlePrismaError throws, so this satisfies the return type
      return handlePrismaError(error, resourceName);
    }
  };
};
