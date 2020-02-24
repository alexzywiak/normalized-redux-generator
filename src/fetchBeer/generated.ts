import normalizedFetchReducer from "../normalizedFetchReducer";
import queryString from "querystring";
import { FetchArguments, NormalizedSchema } from "./types";
import { beers } from "./schema";

const BASE_URL = "https://api.punkapi.com/v2/beers";

export default normalizedFetchReducer<
  FetchArguments,
  any,
  "beers",
  NormalizedSchema
>({
  baseSelector: s => s,
  keyFn: (args: FetchArguments | null) => (args ? [args.beerName] : []),
  fetchFn: async ({ beerName }) => {
    const url = beerName
      ? `${BASE_URL}?${queryString.encode({ beer_name: beerName })}`
      : BASE_URL;

    const resp = await fetch(url);
    const list = await resp.json();
    return { beers: list };
  },
  schema: beers as any
});
