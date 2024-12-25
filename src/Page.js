import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LaptopApp from "./LaptopApp";
import Admin from "./Admin";

function Page() {
  return (
    <HashRouter>
      <Routes>
        <Route path="play" element={<LaptopApp />}></Route>
        <Route path="admin" element={<Admin />}></Route>
        <Route path="/" element={<App />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default Page;
