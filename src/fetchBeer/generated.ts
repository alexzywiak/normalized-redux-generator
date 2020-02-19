import normalizedFetchReducer from "../normalizedFetchReducer";
import { FetchArguments, NormalizedSchema } from "./types";
import { beer } from "./schema";
const BASE_URL = "https://api.punkapi.com/v2/beers";

export default normalizedFetchReducer<
  FetchArguments,
  any,
  "beer",
  NormalizedSchema
>({
  baseSelector: s => s,
  keyFn: (args: FetchArguments | null) => (args ? [args.beerName] : []),
  fetchFn: ({ beerName }) => {
    return fetch(BASE_URL);
  },
  schema: beer
});
