import { ORDER_URL } from "../utils/constants";

// Catalog-only merch. Prices and buy links are placeholders to update with
// real values / store URLs. `buyUrl` opens the order channel (ORDER_URL).
export const products = [
  {
    id: "hehemonia-print",
    name: "HEHEMONIA Print",
    detail: "Album cover art print",
    price: "₴550",
    image: "/hehemonia.png",
    buyUrl: ORDER_URL,
  },
  {
    id: "dil-tee",
    name: "DIL Tee",
    detail: "Heavyweight cotton, front print",
    price: "₴900",
    image: "/dil.png",
    buyUrl: ORDER_URL,
  },
  {
    id: "sss-tee",
    name: "SSS Tee",
    detail: "Heavyweight cotton, front print",
    price: "₴900",
    image: "/sss.png",
    buyUrl: ORDER_URL,
  },
];
