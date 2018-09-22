export interface PagedResult<T> {
    page: number;
    pageSize: number;
    collection: T[];
    count: number;
}