import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import generated from "./fetchBeer/generated";
import Beer from "./Beers";
import "./App.css";

const composeEnhancers = composeWithDevTools({});
const store = createStore(generated.reducer, composeEnhancers());

function App() {
  return (
    <Provider store={store}>
      <Beer />
    </Provider>
  );
}

export default App;
