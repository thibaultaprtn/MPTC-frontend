//Commentaires
//Les routes peuvent être protégée par le composant Protected Route

//Import du package de router et des hooks
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

//Import du context global
import { GlobalContextProvider } from "./context/GlobalContext";

//Import des pages
import Home from "./pages/home.jsx";
import Dashboard from "./pages/private/dashboard.jsx";
import CreateGame from "./pages/private/createGame.jsx";
import JoinGame from "./pages/private/joinGame.jsx";

//Import des pages admin
import AdminDashboard from "./pages/admin/adminDashboard.jsx";
import AddCandidate from "./pages/admin/addCandidate.jsx";

//Import des composants
import ProtectedRoute from "./components/protectedRoute";
import AdminRoute from "./components/adminRoute.jsx";

//Import du CSS
import "./App.css";

function App() {
  return (
    <>
      <GlobalContextProvider>
        <Router>
          {/* <Link to={"/dashboard"}>To Dashboard</Link> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creategame"
              element={
                <ProtectedRoute>
                  <CreateGame />
                </ProtectedRoute>
              }
            />
            <Route
              path="/joingame"
              element={
                <ProtectedRoute>
                  <JoinGame />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admindashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/addcandidate"
              element={
                <AdminRoute>
                  <AddCandidate />
                </AdminRoute>
              }
            />
          </Routes>
        </Router>
      </GlobalContextProvider>
    </>
  );
}

export default App;
