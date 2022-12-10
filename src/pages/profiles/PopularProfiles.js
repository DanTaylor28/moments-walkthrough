import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useCurrentUser } from "../../context/CurrentUserContext";

// passing in mobile so it is destructured.
const PopularProfiles = ({ mobile }) => {
  const [profileData, setProfileData] = useState({
    // using page profile later on!
    pageProfile: { results: [] },
    // we're passing useState hook a popularProfiles attribute, with a value of an object
    // with an empty results array inside
    popularProfiles: { results: [] },
  });
  //   destructuring the popularProfiles attribute from it.
  const { popularProfiles } = profileData;
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
    // If mobile prop exists, we're adding extra styling to the classname attribute.
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularProfiles.results.length ? (
        <>
          <p>Most followed profiles.</p>
          {/* again, if mbile exists, we're displaying the pop profiles differently.
          At the top of the screen with only 4 showing next to eachother. */}
          {mobile ? (
            <div className="d-flex justify-content-around">
              {/* we are slicing the array so only the first 4 profiles show up. */}
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <p key={profile.id}>{profile.owner}</p>
              ))}
            </div>
          ) : (
            popularProfiles.results.map((profile) => (
              <p key={profile.id}>{profile.owner}</p>
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;
