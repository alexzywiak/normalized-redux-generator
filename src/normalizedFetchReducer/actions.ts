import { AMError, KeyedAction, KeyFn } from "./types";

export const ADD_ENTITIES = "ADD_ENTITIES";
export const REQUEST_ENTITIES = "REQUEST_ENTITIES";
export const FAILURE_ENTITIES = "FAILURE_ENTITIES";
export const STALE_ENTITIES = "STALE_ENTITIES";

export interface AddEntities<FETCH_ARGUMENTS, SUCCESS> extends KeyedAction {
  type: typeof ADD_ENTITIES;
  payload: { nestedValue: SUCCESS; fetchArguments: FETCH_ARGUMENTS };
}

export interface RequestEntities<FETCH_ARGUMENTS> extends KeyedAction {
  type: typeof REQUEST_ENTITIES;
  payload: FETCH_ARGUMENTS;
}

export interface FailureEntities extends KeyedAction {
  type: typeof FAILURE_ENTITIES;
  payload: AMError | null;
}

export interface StaleEntities extends KeyedAction {
  type: typeof STALE_ENTITIES;
}

export type NormalizedFetchActionTypes<FETCH_ARGUMENTS, SUCCESS> =
  | AddEntities<FETCH_ARGUMENTS, SUCCESS>
  | RequestEntities<FETCH_ARGUMENTS>
  | FailureEntities
  | StaleEntities;

export type NormalizedActions<FETCH_ARGUMENTS, SUCCESS> = {
  addEntities: (
    fetchArguments: FETCH_ARGUMENTS,
    payload: SUCCESS
  ) => AddEntities<FETCH_ARGUMENTS, SUCCESS>;
  requestEntities: (
    fetchArguments: FETCH_ARGUMENTS
  ) => RequestEntities<FETCH_ARGUMENTS>;

  failureEntities: (
    fetchArguments: FETCH_ARGUMENTS,
    error: AMError | null
  ) => FailureEntities;
  staleEntities: (fetchArguments: FETCH_ARGUMENTS) => StaleEntities;
  fetchFn: (args: FETCH_ARGUMENTS) => Promise<SUCCESS>;
};

const generateNormalizedActions = <FETCH_ARGUMENTS, SUCCESS>(
  keyFn: KeyFn<FETCH_ARGUMENTS>,
  fetchFn: (args: FETCH_ARGUMENTS) => Promise<SUCCESS>
): NormalizedActions<FETCH_ARGUMENTS, SUCCESS> => {
  const addEntities = (
    fetchArguments: FETCH_ARGUMENTS,
    payload: SUCCESS
  ): AddEntities<FETCH_ARGUMENTS, SUCCESS> => {
    return {
      type: ADD_ENTITIES,
      payload: { nestedValue: payload, fetchArguments },
      keys: keyFn(fetchArguments)
    };
  };

  const requestEntities = (
    fetchArguments: FETCH_ARGUMENTS
  ): RequestEntities<FETCH_ARGUMENTS> => ({
    type: REQUEST_ENTITIES,
    payload: fetchArguments,
    keys: keyFn(fetchArguments)
  });

  const failureEntities = (
    fetchArguments: FETCH_ARGUMENTS,
    error: AMError | null
  ): FailureEntities => ({
    type: FAILURE_ENTITIES,
    payload: error,
    keys: keyFn(fetchArguments)
  });

  const staleEntities = (fetchArguments: FETCH_ARGUMENTS): StaleEntities => ({
    type: STALE_ENTITIES,
    keys: keyFn(fetchArguments)
  });

  return {
    addEntities,
    requestEntities,
    failureEntities,
    staleEntities,
    fetchFn
  };
};

export default generateNormalizedActions;
