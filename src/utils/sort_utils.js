export const buildSort = (query) => {
  return {
    [query.sort]: query.order,
  };
};
