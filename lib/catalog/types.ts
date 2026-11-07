export type Category = "ropa" | "tecnologia";

export interface NormalizedProduct {
  source: string;
  externalId: string;
  category: Category;
  title: string;
  brand: string | null;
  imageUrl: string | null;
  priceUsd: number | null;
  productUrl: string | null;
  isTrending: boolean;
}

export interface CatalogProvider {
  id: string;
  fetchProducts(): Promise<NormalizedProduct[]>;
}
