//Commentaires
//Les routes peuvent être protégée par le composant Protected Route

//Import du package de router et des hooks
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

//Import du context global
import { GlobalContextProvider } from "./context/GlobalContext";

//Import des pages
import Home from "./pages/Home";
import Private from "./pages/private";

//Import des composants
import ProtectedRoute from "./components/protectedRoute";

//Import du CSS
import "./App.css";

function App() {
  return (
    <>
      <GlobalContextProvider>
        <Router>
          <Link to={"/private"}>To private</Link>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/private"
              element={
                <ProtectedRoute>
                  <Private />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </GlobalContextProvider>
    </>
  );
}

export default App;
