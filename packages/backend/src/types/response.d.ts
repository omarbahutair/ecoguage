interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    count: number;
  };
}
