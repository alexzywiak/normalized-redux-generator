import cloneDeep from "lodash/cloneDeep";
import mergeWith from "lodash/mergeWith";

export function keyNester<S1 extends string, V>(
  keys: [S1],
  value: V
): { [key in S1]: V };
export function keyNester<S1 extends string, S2 extends string, V>(
  keys: [S1, S2],
  value: V
): { [key in S1]: { [key in S2]: V } };
export function keyNester<
  S1 extends string,
  S2 extends string,
  S3 extends string,
  V
>(
  keys: [S1, S2, S3],
  value: V
): { [key in S1]: { [key in S2]: { [key in S3]: V } } };
export function keyNester<V>(keys: string[], value: V): any;

export function keyNester(keys: string[], value: any) {
  if (!keys.length) {
    return value;
  }
  return [...keys].reverse().reduce((acc, key, idx) => {
    if (idx === 0) {
      return { [key]: value };
    }
    return { [key]: acc };
  }, {});
}

export const cloneAndMerge = <S, T>(
  src: S,
  target: T,
  overwrite: { [key: string]: true } = {}
): S & T => {
  const customizer = (objValue: any, srcValue: any, key: string) => {
    // Never merge array values
    if (Array.isArray(srcValue)) {
      return srcValue;
    }
    if (overwrite[key]) {
      return srcValue;
    }
  };
  return mergeWith(cloneDeep(src), cloneDeep(target), customizer);
};
