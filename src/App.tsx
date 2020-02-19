import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "./App.css";

const store = createStore(s => s);

function App() {
  return <Provider store={store}>{null}</Provider>;
}

export default App;
