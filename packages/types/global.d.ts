export {};

declare global {
  interface ISorterState {
    sortType: ISortType;
    direction: 'asc' | 'desc';
  }
}
