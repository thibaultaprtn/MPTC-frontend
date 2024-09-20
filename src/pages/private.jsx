import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { FIREBASE_AUTH } from "../FirebaseConfig";

const Private = () => {
  const auth = FIREBASE_AUTH;
  const { logOut, user } = useContext(GlobalContext);
  // console.log(user.email);
  // console.log(auth.currentUser.email);

  return (
    <div>
      <p>Private Page</p>
      <p>You are already logged in</p>
      <p></p>
      <button
        onClick={() => {
          logOut(auth);
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Private;
