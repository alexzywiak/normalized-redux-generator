import useFetch from "../fetchHook/useFetch";
import { FetchArguments } from "./types";
import generated from "./generated";

const { actions, selectors } = generated;

export default (args: FetchArguments) =>
  useFetch({
    args,
    actions: {
      ...actions,
      failure: actions.failureEntities,
      request: actions.requestEntities,
      success: actions.addEntities,
      stale: actions.staleEntities
    },
    selector: selectors.getFetchMetadata(args)
  });
