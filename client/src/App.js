import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import UserList from "./components/UserList";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Prova de Scripts CRUD de produtos - Eric Moura</h1>
        </header>
        <Navbar />
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/produtos" element={<ProductList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
