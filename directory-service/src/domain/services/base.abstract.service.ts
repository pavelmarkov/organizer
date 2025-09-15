export abstract class BaseAbstractService<T> {
  abstract get(filter?: Partial<T>): Promise<Partial<T>[]>;
  abstract create(newData: Partial<T>[]): Promise<Partial<T>[]>;
  abstract update?(newValues: Partial<T>[]): Promise<Partial<T>[]>;
  abstract process?(guids: string[]): Promise<{ message: string }>;
}
