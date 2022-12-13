import { COLLECTION_TOKEN_COUNT } from "./constants";
import isoFetch from "isomorphic-fetch";

export const safeFetch = async (url: string) => {
  try {
    const headers = new global.Headers({ Accept: "application/json" });
    const res = await isoFetch(url, { headers });
    return res.json();
  } catch (e) {
    console.log("fetchError:", e);
    return {};
  }
};

export const base64ToBuffer = (value = "") =>
  value ? Buffer.from(value.split("base64,")[1], "base64") : Buffer.from("{}");

export const getRandomTokenId = () =>
  Math.floor(Math.random() * COLLECTION_TOKEN_COUNT) || 1;
