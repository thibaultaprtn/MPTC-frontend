//Dans l'ensemble de mon projet, le user est accessible via les variables de contexte

import { useState, useEffect, createContext } from "react";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import axios from "axios";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useState(auth.currentUser); // L'initialisation va se fait dans le useEffect initial ?
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const signUp = async (auth, email, username, password) => {
    if (!email || !password || !username) return;
    setLoading(true);
    console.log(email, password);
    try {
      const serverresponse = await axios.post(
        `${import.meta.env.VITE_BACKURL}/user/signup`,
        {
          email: email,
          username: username,
        }
      );
      // const firebaseresponse = await createUserWithEmailAndPassword(
      //   auth,
      //   email,
      //   password
      // );
      // console.log("reponse de firebase", firebaseresponse);
      console.log("reponse du serveur", serverresponse.data.message);
      // console.log("reponse du serveur", serverresponse.data.message);
      // console.log(response);
      // alert("Check your emails !");
    } catch (error) {
      console.log(error.message);
      alert("Sign up failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (auth, email, password) => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      console.log("sign in successfull");
      //   alert("Check your emails !");
    } catch (error) {
      console.log(error.message);
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async (auth) => {
    setLoading(true);
    try {
      await signOut(auth);
      console.log("User successfully signout out");
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }
      setUser(null);
      setIsFetching(false);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {isFetching ? (
        <p>Loading</p>
      ) : (
        <GlobalContext.Provider
          value={{ user, loading, signIn, signUp, logOut }}
        >
          {children}
        </GlobalContext.Provider>
      )}
    </>
  );
};
