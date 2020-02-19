import { isEqual } from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Dispatch, Store } from "redux";
import { FetchKeyActions } from "./types";
import { FetchEntityState } from "../normalizedFetchReducer/types";

export const initialEntityState: FetchEntityState<any> = {
  fetchArguments: null,
  error: null,
  isFetching: false,
  isStale: true,
  lastUpdated: null
};

export type ShouldFetch<FETCH_ARGUMENTS, SUCCESS> = (
  entity: Omit<FetchEntityState<FETCH_ARGUMENTS>, "value"> | null,
  currentArgs: FETCH_ARGUMENTS,
  previousArgs: FETCH_ARGUMENTS | null,
  state?: any
) => boolean;

export interface UseFetchKey<FETCH_ARGUMENTS, SUCCESS> {
  actions: FetchKeyActions<FETCH_ARGUMENTS, SUCCESS>;
  args: FETCH_ARGUMENTS | null;
  onFailure?: (
    error: Error,
    dispatch: Dispatch,
    state: any,
    currentArgs: FETCH_ARGUMENTS,
    previousArgs: FETCH_ARGUMENTS | null
  ) => Promise<Error>;
  onSuccess?: (
    value: SUCCESS,
    dispatch: Dispatch,
    state: any
  ) => Promise<SUCCESS>;
  selector: (state: any) => FetchEntityState<FETCH_ARGUMENTS> | null;
  shouldFetch?: ShouldFetch<FETCH_ARGUMENTS, SUCCESS>;
}

export const defaultShouldFetch: ShouldFetch<any, any> = (
  entity,
  currentArgs,
  previousArgs
) => {
  return Boolean(
    !entity ||
      (!entity.isFetching &&
        (entity.isStale || !isEqual(previousArgs, currentArgs)))
  );
};

export const fetchData = <FETCH_ARGUMENTS, SUCCESS>({
  dispatch,
  actions,
  args,
  selector,
  shouldFetch = defaultShouldFetch,
  store,
  onFailure = error => Promise.resolve(error),
  onSuccess = response => Promise.resolve(response)
}: UseFetchKey<FETCH_ARGUMENTS, SUCCESS> & {
  dispatch: Dispatch;
  store: Store;
}) => {
  const { failure, fetchFn, request, success } = actions;
  const callApi = async () => {
    if (args === null) {
      return;
    }
    const entity = selector(store.getState());
    if (
      shouldFetch(
        entity,
        args,
        (entity && entity.fetchArguments) || null,
        store.getState()
      )
    ) {
      dispatch(request(args));
      try {
        const response = await fetchFn(args);
        const modifiedResponse = await onSuccess(
          response,
          dispatch,
          store.getState()
        );
        dispatch(success(args, modifiedResponse));
      } catch (e) {
        const modifiedErrorPayload = await onFailure(
          e,
          dispatch,
          store.getState(),
          args,
          entity && entity.fetchArguments
        );
        dispatch(failure(args, modifiedErrorPayload));
      }
    }
  };
  callApi();
};

export default <FETCH_ARGUMENTS, SUCCESS>(
  args: UseFetchKey<FETCH_ARGUMENTS, SUCCESS>
) => {
  const dispatch = useDispatch();
  const store: any = useStore();
  const entity = useSelector(args.selector);

  useEffect(() => {
    fetchData({ ...args, store, dispatch });
  });

  return entity || (initialEntityState as FetchEntityState<FETCH_ARGUMENTS>);
};
