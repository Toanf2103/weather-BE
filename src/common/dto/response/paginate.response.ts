export class PaginateResponse<T> {
  data: T[]
  currentPage: number
  lastPage: number
  perPage: number
  from: number
  to: number
  total: number
}
