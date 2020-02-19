export type FetchArguments = {
  beerName: string;
};

export type NormalizedSchema = {
  beer: {
    malt: string[];
    hops: string[];
    yeast: string;
    [key: string]: any;
  };
  malt: any;
  hops: any;
  yeast: string;
};
