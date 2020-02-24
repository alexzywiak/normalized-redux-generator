import generated from "./generated";
import { createSelector } from "reselect";

export const getBeer = (id: string) =>
  createSelector(generated.selectors.baseSelector, state => {
    return state["beer"][id];
  });
