import { AnyAction } from "redux";
import { FetchEntityState } from "../normalizedFetchReducer";

export type FetchKeyActions<FETCH_ARGUMENTS, SUCCESS> = {
  failure: (
    args: FETCH_ARGUMENTS,
    payload: FetchEntityState<FETCH_ARGUMENTS>["error"]
  ) => AnyAction;
  fetchFn: (args: FETCH_ARGUMENTS) => Promise<SUCCESS>;
  request: (args: FETCH_ARGUMENTS) => AnyAction;
  stale: (args: FETCH_ARGUMENTS) => AnyAction;
  success: (args: FETCH_ARGUMENTS, payload: SUCCESS) => AnyAction;
};
