export abstract class BaseAbstractRepository<T> {
  abstract findAll(params: {
    filter?: Partial<T>;
    pagination?: { offset: number; limit: number };
    order?: {
      [k in keyof T]?: "asc" | "desc";
    };
  }): Promise<Partial<T>[]>;
  abstract count(filter?: Partial<T>): Promise<number>;
  abstract findOne(id: string): Promise<Partial<T>>;
  abstract getNextItemId(currentItem: T): Promise<string | null>;
  abstract getPreviousItemId(currentItem: T): Promise<string | null>;
  abstract upsertMany(
    newData: (Partial<T> & Pick<T, keyof T>)[]
  ): Promise<Partial<T>[]>;
}
