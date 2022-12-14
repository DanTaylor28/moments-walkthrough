import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { followHelper } from "../utils/utils";
import { unfollowHelper } from "../utils/utils";
import { useCurrentUser } from "../context/CurrentUserContext";

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

  const handleFollow = async (clickedProfile) => {
    // Adding a try/catch block since we are making a network request.
    try {
      // destructure data property from the response object.
      // data being sent is information about what profile the user jsut followed,
      // which is the id of the profile being clicked.
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          // so the following/followers update without refresh also,
          // we can just reuse the code from below to map over all the profiles once again.
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosRes.delete(`/followers/${clickedProfile.following_id}`);
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

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
    // sending the handlefollow function alongside profileData so the profile components have
    // access to it when the button is clicked.
    // You have to add a second pair of curly braces to send them as an object (the only way to send more than one function?)
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={{ setProfileData, handleFollow, handleUnfollow }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

