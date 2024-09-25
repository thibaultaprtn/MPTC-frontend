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
  const [isSignUpActive, setIsSignUpActive] = useState(false);

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
              <div>Login Page</div>
              <form>
                {isSignUpActive && <legend> Sign Up </legend>}
                {!isSignUpActive && <legend> Sign In </legend>}
                <label htmlFor="email"></label>
                <input
                  id="email"
                  value={email}
                  type="email"
                  placeholder="email"
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
                      id="Username"
                      value={username}
                      type="text"
                      placeholder="Username"
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
                  id="password"
                  value={password}
                  type="password"
                  placeholder="password"
                  onChange={handlePasswordChange}
                />

                {isSignUpActive && (
                  <button
                    type="button"
                    title="CreateAccount"
                    onClick={() => {
                      signable && signUp(auth, email, username, password);
                    }}
                  >
                    Create Account
                  </button>
                )}
                {!isSignUpActive && (
                  <button
                    type="button"
                    title="CreateAccount"
                    onClick={() => {
                      signIn(auth, email, password);
                    }}
                  >
                    Login
                  </button>
                )}

                <button
                  title="Logout"
                  onClick={() => {
                    logOut(auth);
                  }}
                >
                  Log out
                </button>
              </form>

              <p>current user :</p>
              <p>{user?.email}</p>
              {isSignUpActive && <a onClick={handleMethodChange}>Log in</a>}
              {!isSignUpActive && (
                <a onClick={handleMethodChange}>Create an Account</a>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Home;
