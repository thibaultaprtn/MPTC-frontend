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
  // console.log(auth.currentUser);
  const [user, setUser] = useState(auth.currentUser);
  const [userMongoId, setUserMongoId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  //Routes à sécuriser

  const signUp = async (auth, email, username, password) => {
    if (!email || !password || !username) return;
    setLoading(true);
    // console.log(email, password);
    try {
      const serverresponse = await axios.post(
        `${import.meta.env.VITE_BACKURL}/user/signup`,
        {
          email: email,
          username: username,
        }
      );
      const firebaseresponse = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log(
      //   "reponse de firebase",
      //   firebaseresponse._tokenResponse.idToken
      // );
      // console.log("reponse du serveur", serverresponse.data.message);
      // setToken(firebaseresponse._tokenResponse.idToken);
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
      // console.log("au seing de la reponse dans le sign in", response);
      // const responseIdfromServer = await axios.get(
      //   `${import.meta.env.VITE_BACKURL}/user/idfromemail`,
      //   { params: { email: email } },
      //   { headers: { Authorization: "Bearer " + response.user.accessToken } }
      // );
      // console.log("reponse de l'Id du serveur", responseIdfromServer);
      // setUserMongoId(responseIdfromServer.data.userMongoId);
      // console.log(response);
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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          //Si le changement de statut correspond à une authentification, on a un profil user (équivalent userCredentials)
          //On récupère les infos firebase du user, et son token
          //Remarque : le token est redondant avec le use. Je le garde quand même à part pour gérer plus clairement les requêtes

          const idtoken = await user.getIdToken();
          // console.log("onAuthStateChanged : idToken ====>", idtoken);
          // console.log(
          //   "onAuthStateChanged : accessToken ====>",
          //   user.accessToken
          // );
          setToken(idtoken);

          //Si c'est une authentification, on veut récupérer l'id mongodb correspond au profil de l'utilisateur.
          //Il faut sécuriser la requête.
          //Dans le back on peut vérifier que le token est valid avec le middleware isAuthenticated.
          //Il faudrait également s'assurer que l'email que l'on communique et celui associé au token sont bien identiques, sinon n'importe qui d'authentifié peut récupérer les id des profils dont il a le mail.

          const responseIdfromServer = await axios.get(
            `${import.meta.env.VITE_BACKURL}/user/idfromemail`,
            {
              // params: { email: "admin@gmail.com" },
              // params: { email: user.email },
              headers: {
                Authorization: "Bearer " + idtoken,
                email: user.email,
              },
            }
          );
          // console.log("reponse de l'Id du serveur", responseIdfromServer);

          setUserMongoId(responseIdfromServer.data.userMongoId);
          setIsAdmin(responseIdfromServer.data.isAdmin);
          setIsFetching(false);
          setUser(user);
          return;
        }
        setToken(null);
        setUser(null);
        setUserMongoId(null);
        setIsAdmin(false);
        setIsFetching(false);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
    return unsubscribe;
  }, []);

  // console.log("userMongoId", userMongoId);

  return (
    <>
      {isFetching ? (
        <p>Loading</p>
      ) : (
        <GlobalContext.Provider
          value={{
            user,
            userMongoId,
            isAdmin,
            token,
            loading,
            signIn,
            signUp,
            logOut,
          }}
        >
          {children}
        </GlobalContext.Provider>
      )}
    </>
  );
};
