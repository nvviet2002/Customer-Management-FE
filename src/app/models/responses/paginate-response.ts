export interface PaginateResponse {
  totalCount: number;
  totalPages: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  pageNext: number;
  pagePrevious: number;
  items: any[];
}
