import moment from "moment";
import { normalize, Schema } from "normalizr";
import { cloneAndMerge, keyNester } from "./utils";
import { FetchEntityState } from "./types";
import {
  ADD_ENTITIES,
  AddEntities,
  FAILURE_ENTITIES,
  FailureEntities,
  NormalizedFetchActionTypes,
  REQUEST_ENTITIES,
  RequestEntities,
  STALE_ENTITIES
} from "./actions";

export const initialFetchMetadata: FetchEntityState<any, any> = {
  isFetching: false,
  isStale: true,
  error: null,
  fetchArguments: null,
  value: null,
  lastUpdated: null
};

const handleRequestEntities = <F>(
  state: any,
  payload: RequestEntities<F>["payload"],
  keys: string[]
) => {
  const fetchMetadata: Partial<FetchEntityState<F, any>> = {
    isFetching: true,
    fetchArguments: payload,
    isStale: false
  };
  return cloneAndMerge(state, keyNester(keys, { fetchMetadata }), {
    fetchArguments: true
  });
};

const handleAddEntities = <F, S>(
  state: any,
  payload: AddEntities<F, S>["payload"],
  schema: Schema
) => {
  const { nestedValue, fetchArguments } = payload;
  const fetchMetadata: Partial<FetchEntityState<F, any>> = {
    fetchArguments,
    isFetching: false,
    isStale: false,
    error: null,
    lastUpdated: moment().valueOf()
  };
  const { entities } = normalize({ fetchMetadata, ...nestedValue }, schema);
  const newState = cloneAndMerge(state, entities);
  return newState;
};

const handleFailureEntities = (
  state: any,
  payload: FailureEntities["payload"],
  keys: string[]
): any => {
  const fetchMetadata = {
    isFetching: false,
    isStale: false,
    error: payload,
    lastUpdated: moment().valueOf()
  };
  return cloneAndMerge(
    state,
    keyNester(keys, {
      fetchMetadata
    }) as any,
    { error: true }
  );
};

const handleStaleEntities = (state: any, keys: string[]): any => {
  const fetchMetadata = {
    isStale: true
  };
  return cloneAndMerge(
    state,
    keyNester(keys, {
      fetchMetadata
    }) as any
  );
};

// Only supports single reducer instance.  Need to be able to handle multiple schemas.  Move normalization to actions?  Pull key off actions?
export default <FETCH_ARGUMENTS, SUCCESS>(schema: Schema) => (
  state: any,
  action: NormalizedFetchActionTypes<FETCH_ARGUMENTS, SUCCESS>
): any => {
  if (!state) {
    return {} as any;
  }
  if (!action) {
    return state;
  }

  const { type, payload, keys } = action;

  switch (type) {
    case REQUEST_ENTITIES:
      return handleRequestEntities(
        state,
        payload as RequestEntities<FETCH_ARGUMENTS>["payload"],
        keys
      );
    case ADD_ENTITIES:
      return handleAddEntities(
        state,
        payload as AddEntities<FETCH_ARGUMENTS, SUCCESS>["payload"],
        schema
      );
    case FAILURE_ENTITIES:
      return handleFailureEntities(
        state,
        payload as FailureEntities["payload"],
        keys
      );
    case STALE_ENTITIES:
      return handleStaleEntities(state, keys);
    default:
      return state;
  }
};
