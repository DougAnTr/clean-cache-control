import { CacheStoreSpy, mockPurchases } from "@/data/tests";
import { LocalLoadPurchases } from "./local-load-purchases";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);

  return {
    sut,
    cacheStore,
  };
};

describe("LocalSavePurchases", () => {
  it("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });
});
