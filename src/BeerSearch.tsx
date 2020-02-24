import React, { ChangeEvent } from "react";

interface BeerSearchProps {
  value: string;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
}
const BeerSearch = ({ value, onChange }: BeerSearchProps) => {
  return (
    <>
      <label>Search Beers: </label>
      <input value={value} onChange={onChange}></input>
    </>
  );
};

BeerSearch.displayName = "BeerSearch";
export default BeerSearch;
