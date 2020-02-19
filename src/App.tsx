import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import generated from "./fetchBeer/generated";
import Beer from "./Beer";
import "./App.css";

const store = createStore(generated.reducer);

function App() {
  return (
    <Provider store={store}>
      <Beer />
    </Provider>
  );
}

export default App;
