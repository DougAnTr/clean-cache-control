import { CacheStore } from "@/data/protocols/cache";
import { LocalSavePurchases } from "./local-save-purchases";

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  key: string;

  delete(key: string): void {
    this.key = key;
    this.deleteCallsCount++;
  }
}

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);

  return {
    sut,
    cacheStore,
  };
};

describe("LocalSavePurchases", () => {
  it("Should not delete cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it("Should delete old cache on sut.save", async () => {
    const { sut, cacheStore } = makeSut();

    await sut.save();
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.key).toBe("purchases");
  });

  it("Should not insert new cache if delete fails", () => {
    const { sut, cacheStore } = makeSut();
    jest.spyOn(cacheStore, "delete").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.save();
    expect(promise).rejects.toThrow();
    expect(cacheStore.insertCallsCount).toBe(0);
  });
});
