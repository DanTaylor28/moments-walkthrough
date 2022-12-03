import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleMount = async () => {
    try {
      const { data } = await axios.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);
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
