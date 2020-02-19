import { KeyFn } from "./types";
import generateFetchSchemaActions from "./actions";
import generateFetchSchemaReducer from "./reducer";
import generateFetchSchemaSelectors from "./selectors";
import { GenerateNormalizedFetchReducer } from "./types";

export default <
  FETCH_ARGUMENTS,
  SUCCESS,
  ROOT_SCHEMA extends keyof NORMALIZED_SCHEMA,
  NORMALIZED_SCHEMA
>({
  baseSelector,
  keyFn,
  fetchFn,
  schema
}: GenerateNormalizedFetchReducer<
  FETCH_ARGUMENTS,
  SUCCESS,
  ROOT_SCHEMA,
  NORMALIZED_SCHEMA
>) => {
  const normalizedKeyFn: KeyFn<FETCH_ARGUMENTS> = (
    args: FETCH_ARGUMENTS | null
  ) => [schema.key, ...keyFn(args)];

  schema.getId = ({ fetchMetadata: { fetchArguments } }) =>
    keyFn(fetchArguments).join();

  return {
    normalizedKeyFn,
    actions: generateFetchSchemaActions<FETCH_ARGUMENTS, SUCCESS>(
      normalizedKeyFn,
      fetchFn
    ),
    reducer: generateFetchSchemaReducer<FETCH_ARGUMENTS, SUCCESS>(schema),
    selectors: generateFetchSchemaSelectors<
      FETCH_ARGUMENTS,
      SUCCESS,
      ROOT_SCHEMA,
      NORMALIZED_SCHEMA
    >({
      baseSelector,
      keyFn: normalizedKeyFn,
      schema
    })
  };
};
