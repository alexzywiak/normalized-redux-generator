import React, { useState, useCallback, ChangeEvent } from "react";
import useBeer from "./fetchBeer/hook";
import { useSelector } from "react-redux";
import generated from "./fetchBeer/generated";
import BeerSearch from "./BeerSearch";
import Beer from "./Beer";

interface BeerProps {}
const Beers = (props: BeerProps) => {
  const [beerName, setBeerName] = useState("punk");
  useBeer({ beerName });
  const beerList = useSelector(generated.selectors.getValue({ beerName }));
  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setBeerName(evt.target.value);
    },
    [setBeerName]
  );

  return (
    <>
      <BeerSearch value={beerName} onChange={onChange} />
      <h1>Beers</h1>
      <ul>
        {beerList && beerList.beers
          ? beerList.beers.map(beerId => (
              <li key={beerId}>
                <Beer id={beerId} />
              </li>
            ))
          : null}
      </ul>
    </>
  );
};

Beers.displayName = "Beers";
export default Beers;
