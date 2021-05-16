import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain";
import { LocalSavePurchases } from "./local-save-purchases";

class CacheStoreSpy implements CacheStore {
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

const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: "1",
    date: new Date(),
    value: 50,
  },
  {
    id: "2",
    date: new Date(),
    value: 40,
  },
];

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
