import React from "react";

import Container from "reactstrap/lib/Container";
import { BiliList, BiliHeader } from "./module/bill";
import { LocaleStoreProvider } from "./store";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <LocaleStoreProvider>
      <Container style={{ marginTop: 50 }}>
        <BiliHeader />
        <BiliList />
      </Container>
    </LocaleStoreProvider>
  );
}

export default App;
