import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { user, loading, signIn, signUp, logOut } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [signable, setSignable] = useState(true);
  const auth = FIREBASE_AUTH;
  const [isSignUpActive, setIsSignUpActive] = useState(true);

  useEffect(() => {
    const usernametemp = username;
    // console.log("usernametemp", usernametemp);
    const emailtemp = email;
    // console.log("emailtemp", emailtemp);
    const fetchdata = async (req, res) => {
      try {
        const attributeddata = await axios.get(
          `${import.meta.env.VITE_BACKURL}/user/attributeduserdetails`,
          {
            params: { username: usernametemp, email: emailtemp },
          }
        );
        // console.log(attributeddata.data);
        setValidEmail(attributeddata.data.email);
        setValidUsername(attributeddata.data.username);
        setSignable(attributeddata.data.email && attributeddata.data.username);
        // console.log("setSignable", signable);
        // console.log("data", data);
        // datausername ? setValidUsername(false) : setValidUsername(true);
        // dataemail ? setValidEmail(false) : setEmail(true);
        // datausername && dataemail ? setSignable(true) : setSignable(false);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
    const timer = setTimeout(() => {
      fetchdata();
    }, 350);
    return () => clearTimeout(timer);
  }, [username, email]);

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleEmailChange = async (event) => {
    setEmail(event.target.value);
    // const response = await axios(
    //   `${import.meta.env.VITE_BACKURL}/user/attributedemails`,
    //   { params: { email: event.target.value } }
    // );
  };

  const handleUsernameChange = async (event) => {
    setUsername(event.target.value);
    // const response = await axios(
    //   `${import.meta.env.VITE_BACKURL}/user/attributedusernames`,
    //   { params: { username: event.target.value } }
    // );
  };

  const handlePasswordChange = (event) => setPassword(event.target.value);

  // console.log(signable);

  return (
    <>
      {user ? (
        <Navigate to="/dashboard"></Navigate>
      ) : (
        <>
          {loading ? (
            <p>Chargement</p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <h1>MON PETIT TOP CHEF</h1>
              </div>
              <div
                style={{
                  // height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  className="logindiv"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <form
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 15,
                    }}
                  >
                    {isSignUpActive && <legend> INSCRIS TOI </legend>}
                    {!isSignUpActive && <legend> CONNECTE TOI </legend>}
                    <label htmlFor="email"></label>
                    <input
                      className="logininput"
                      id="email"
                      value={email}
                      type="email"
                      placeholder="Email"
                      onChange={handleEmailChange}
                    />
                    <p
                      hidden={isSignUpActive && validEmail}
                      style={{ color: "red" }}
                    >
                      Email déjà attribué
                    </p>
                    {isSignUpActive && (
                      <>
                        <label htmlFor="Username"></label>
                        <input
                          className="logininput"
                          id="Username"
                          value={username}
                          type="text"
                          placeholder="Nom d'utilisateur"
                          onChange={handleUsernameChange}
                        />
                        <p
                          hidden={isSignUpActive && validUsername}
                          style={{ color: "red" }}
                        >
                          Username déjà attribué
                        </p>
                      </>
                    )}
                    <label htmlFor="password"></label>
                    <input
                      className="logininput"
                      id="password"
                      value={password}
                      type="password"
                      placeholder="Mot de passe"
                      onChange={handlePasswordChange}
                    />

                    {isSignUpActive && (
                      <button
                        className="loginbutton"
                        type="button"
                        title="CreateAccount"
                        onClick={() => {
                          signable && signUp(auth, email, username, password);
                        }}
                      >
                        CRÉER UN COMPTE
                      </button>
                    )}
                    {!isSignUpActive && (
                      <button
                        className="loginbutton"
                        type="button"
                        title="CreateAccount"
                        onClick={() => {
                          signIn(auth, email, password);
                        }}
                      >
                        LOGIN
                      </button>
                    )}

                    {/* <button
                      title="Logout"
                      onClick={() => {
                        logOut(auth);
                      }}
                    >
                      Log out
                    </button> */}
                  </form>

                  {/* <p>current user :</p>
                  <p>{user?.email}</p> */}
                  {isSignUpActive && (
                    <a onClick={handleMethodChange}>
                      Tu as déjà un compte ? Connecte toi !
                    </a>
                  )}
                  {!isSignUpActive && (
                    <a onClick={handleMethodChange}>
                      Tu n'as pas encore de compte ? Inscris toi !
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Home;
