/**
 * Builds pagination values from query parameters.
 *
 * Example:
 * GET /expenses?page=2&limit=10
 *
 * Returns:
 * {
 *   page: 2,
 *   limit: 10,
 *   skip: 10
 * }
 */
export const buildPagination = (query) => {
  const { page, limit } = query;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

// Builds pagination metadata.
export const buildPaginationMetadata = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
