import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  const handleMount = async () => {
    try {
      // axios updated to use axios.Res defined below to stop user getting signed out after 5 mins.
      // will stay logged in for 24hrs as thats default lifespan of refresh token
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);
  // runs before children components mount, and we want to attach the interceptors before they mount,
  // therfore we use useMemo()
  useMemo(() => {

    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()){
          try {
            // try to refresh token before sending request
            await axios.post('/dj-rest-auth/token/refresh/')
          } catch(err) {
            // if try fails, and user was prev logged in, that means refresh token has expired
            // therfore, we will redirect to login page & set current user to null.
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push('/signin')
              }
              return null
            });
            // return request config in and outside catch block
            removeTokenTimestamp()
            return config;
          }
        }
        
        return config;
      },
      // if theres an error, reject promise with it.
      (err) => {
        return Promise.reject(err)
      }
    );

    // creates response interceptor - attached to axiosRes created by me in axiosDefaults.js
    axiosRes.interceptors.response.use(
      // if no error, just return response
      (response) => response,
      // if there is error, we're checking if the error is status 401(unauthorised)
      async (err) => {
        if (err.response?.status === 401){
          try {
            // attempt to refresh the token inside a try block
            await axios.post('/dj-rest-auth/token/refresh/')
          } catch(err) {
            // if try fails, we are ensuring a user was previosuly logged in and then
            // redirecting them to signin page using history as used previously.
            setCurrentUser(prevCurrentUser => {
              if (prevCurrentUser){
                history.push('/signin')
              }
              // setting users data to null
              return null
            })
            removeTokenTimestamp()
          }
          // if theres no error refreshing the token, an axios instance
          // is returned with err.config to exit the interceptor.
          return axios(err.config)
        }
        // if error wasn't 401, the promise is rejected with the error to exit
        // the interceptor.
        return Promise.reject(err)
      }
    )
    // added dependency array, for useMemo hook with history inside so it only runs once
    // when component mounts, if its empty, the linter will throw a warning. Because we have no code to use
    // interceptor with yet - this will change later..
  }, [history])

  return (
    // these 2 context providers will allow both currentUser value and the function
    // to update it, to be available to every child component in the application.
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider
        value={setCurrentUser}>
            {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

