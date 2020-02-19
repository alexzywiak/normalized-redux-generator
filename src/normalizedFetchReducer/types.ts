import { AnyAction } from "redux";
import { schema } from "normalizr";

export interface FetchEntityState<FETCH_ARGUMENTS, VALUE> {
  fetchArguments: FETCH_ARGUMENTS | null;
  isFetching: boolean;
  isStale: boolean;
  value: VALUE | null;
  error: AMError | null;
  lastUpdated: number | null;
}

export interface AMError {
  status?: number;
  code?: number;
  error: string;
}

export type KeyedAction = AnyAction & { keys: string[] };
export type KeyFn<F> = (args: F | null) => string[];

export type FetchMetadata<F> = Omit<FetchEntityState<F, any>, "value">;

export type NormalizedEntityState<F, S> = S & {
  fetchMetadata: FetchMetadata<F>;
};

type WithUUID<S extends { [schemaKey: string]: any }> = {
  [K in keyof S]: {
    [uuid: string]: S[K];
  };
};

export type NormalizedState<
  F,
  K extends keyof NORMALIZED_SCHEMA,
  NORMALIZED_SCHEMA extends { [schemaKey: string]: any }
> = WithUUID<NORMALIZED_SCHEMA> &
  {
    [rootKey in K]: {
      [uuid: string]: NormalizedEntityState<F, NORMALIZED_SCHEMA[K]>;
    };
  };

export type GenerateNormalizedFetchReducer<
  FETCH_ARGUMENTS,
  SUCCESS,
  ROOT_SCHEMA extends keyof NORMALIZED_SCHEMA,
  NORMALIZED_SCHEMA
> = {
  baseSelector: (
    state: any
  ) => NormalizedState<FETCH_ARGUMENTS, ROOT_SCHEMA, NORMALIZED_SCHEMA>;
  fetchFn: (args: FETCH_ARGUMENTS) => Promise<SUCCESS>;
  keyFn: KeyFn<FETCH_ARGUMENTS>;
  schema: schema.Entity;
};

export type NormalizedSelectors<
  FETCH_ARGUMENTS,
  ROOT_SCHEMA extends keyof NORMALIZED_SCHEMA,
  NORMALIZED_SCHEMA
> = {
  baseSelector: (
    state: any
  ) => NormalizedState<FETCH_ARGUMENTS, ROOT_SCHEMA, NORMALIZED_SCHEMA>;
  keyFn: KeyFn<FETCH_ARGUMENTS>;
  schema: schema.Entity;
};
