import React from "react";
import { useSelector } from "react-redux";
import { getBeer } from "./fetchBeer/selectors";

interface BeerProps {
  id: string;
}
const Beer = ({ id }: BeerProps) => {
  const beer = useSelector(getBeer(id));
  return beer ? <span>{beer.name}</span> : null;
};

Beer.displayName = "Beer";
export default Beer;
