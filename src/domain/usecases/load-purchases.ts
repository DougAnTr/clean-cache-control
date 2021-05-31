import { PurchaseModel } from "@/domain/models";

export interface LoadPurchases {
  loadAll: (
    purchases: Array<LoadPurchases.Result>
  ) => Promise<Array<LoadPurchases.Result>>;
}

export namespace LoadPurchases {
  export type Result = PurchaseModel;
}
