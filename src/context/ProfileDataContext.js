import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // using page profile later on!
    pageProfile: { results: [] },
    // we're passing useState hook a popularProfiles attribute, with a value of an object
    // with an empty results array inside
    popularProfiles: { results: [] },
  });
  const currentUser = useCurrentUser();
  useEffect(() => {
    const handleMount = async () => {
      try {
        // making a request for the descending list of the most followed profiles.
        // ie most followed at the top and descending.
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          // spreading prev state and setting popularProfiles with the data returned from the api request.
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [currentUser]);
  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={setProfileData}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
