import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { user, loading, signIn, signUp, logOut } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = FIREBASE_AUTH;
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  //   useEffect(() => {
  //     onAuthStateChanged(FIREBASE_AUTH, (user) => {
  //       console.log("console log from login page : user ===>", user);
  //     });
  //   }, []);

  return (
    <>
      {user ? (
        <Navigate to="/private"></Navigate>
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
                      signUp(auth, email, password);
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

                {/* <button title="Login" onClick={signIn}>
            Login
          </button> */}

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
              {/* <p>{auth.currentUser}</p> */}
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
