import { schema } from "normalizr";

export const malt = new schema.Entity(
  "malt",
  {},
  {
    idAttribute: malt => malt.name
  }
);
export const hops = new schema.Entity(
  "hops",
  {},
  {
    idAttribute: hops => {
      return hops.name;
    }
  }
);

export const beer = new schema.Entity("beer", {
  ingredients: {
    malt: [malt],
    hops: [hops]
  }
});

export const beers = new schema.Entity("beers", { beers: [beer] });
