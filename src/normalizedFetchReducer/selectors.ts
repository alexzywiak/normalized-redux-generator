import { denormalize } from "normalizr";
import { createSelector } from "reselect";
import { NormalizedEntityState, NormalizedSelectors } from "./types";

export default <
  FETCH_ARGUMENTS,
  SUCCESS,
  ROOT_SCHEMA extends keyof NORMALIZED_SCHEMA,
  NORMALIZED_SCHEMA
>({
  baseSelector,
  keyFn,
  schema
}: NormalizedSelectors<FETCH_ARGUMENTS, ROOT_SCHEMA, NORMALIZED_SCHEMA>) => {
  const getRoot = (args: FETCH_ARGUMENTS | null) => {
    const keys = keyFn(args);
    return createSelector(baseSelector, state => {
      const entity = keys.reduce(
        (res, key) => {
          if (res) {
            return res[key] || null;
          }
          return res;
        },
        state as any
      );
      return entity && Object.keys(entity).length
        ? (entity as NormalizedEntityState<
            FETCH_ARGUMENTS,
            NORMALIZED_SCHEMA[ROOT_SCHEMA]
          >)
        : null;
    });
  };

  const getValue = (args: FETCH_ARGUMENTS) =>
    createSelector(getRoot(args), root => {
      if (!root) {
        return null;
      }
      const { fetchMetadata, ...rest } = root;
      return rest;
    });

  const getFetchMetadata = (args: FETCH_ARGUMENTS) =>
    createSelector(getRoot(args), root => (root ? root.fetchMetadata : null));

  const denormalizeRoot = (args: FETCH_ARGUMENTS) =>
    createSelector([baseSelector, getRoot(args)], (entities, root) => {
      return denormalize(root, schema, entities) as SUCCESS;
    });

  return { baseSelector, getFetchMetadata, getValue, denormalizeRoot };
};
