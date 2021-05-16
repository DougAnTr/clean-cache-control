import { CacheStoreSpy, mockPurchases } from "@/data/tests";
import { LocalSavePurchases } from "./local-save-purchases";

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
    const purchases = mockPurchases();

    await sut.save(purchases);
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  it("Should not insert new cache if delete fails", () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateDeleteError();

    const purchases = mockPurchases();
    const promise = sut.save(purchases);
    expect(promise).rejects.toThrow();
    expect(cacheStore.insertCallsCount).toBe(0);
  });

  it("Should insert new cache if delete succeeds", async () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();

    await sut.save(purchases);

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe("purchases");
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  it("Should throw if insert throws", () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();
    cacheStore.simulateInsertError();
    const promise = sut.save(purchases);

    expect(promise).rejects.toThrow();
  });
});
