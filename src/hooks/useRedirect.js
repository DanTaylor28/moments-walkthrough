import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

// userAuthStatus will be set to a string either 'loggedin' or 'loggedout'
export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  //   to know if a user is logged in or not, we need to make a network request on mount,
  // therfore we are using useEffect
  useEffect(() => {
    const handleMount = async () => {
      try {
        // we dont need to use interceptors here(req/res) cause the endpoint
        // will let us know if the user is authenticated or not.
        await axios.post("/dj-rest-auth/token/refresh/");
        // if the user is logged in, then the below code will run, otherwise the catch code will.
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // code to run, if user is not logged in.
        if (userAuthStatus === "loggedOut") {
          history.push("/");
        }
      }
    };
    handleMount();
  }, [history, userAuthStatus]);
};
