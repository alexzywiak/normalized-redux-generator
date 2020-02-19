import React from "react";
import useBeer from "./fetchBeer/hook";

interface BeerProps {}
const Beer = (props: BeerProps) => {
  useBeer({ beerName: "punk" });
  return <>beer</>;
};

Beer.displayName = "Beer";
export default Beer;
