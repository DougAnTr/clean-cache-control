import { SavePurchases } from "@/domain/usecases";
import { CacheStore } from "../protocols/cache";

export class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey: string;
  insertKey: string;
  insertValues: Array<SavePurchases.Params>;

  delete(key: string): void {
    this.deleteKey = key;
    this.deleteCallsCount++;
  }

  insert(key: string, value: any): void {
    this.insertKey = key;
    this.insertCallsCount++;
    this.insertValues = value;
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
      throw new Error();
    });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
      throw new Error();
    });
  }
}
