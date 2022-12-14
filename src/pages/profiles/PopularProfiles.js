import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useProfileData } from "../../context/ProfileDataContext";
import Profile from "./Profile";

// passing in mobile so it is destructured.
const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

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
          {/* again, if mobile exists, we're displaying the pop profiles differently.
          At the top of the screen with only 4 showing next to eachother. */}
          {mobile ? (
            <div className="d-flex justify-content-around">
              {/* we are slicing the array so only the first 4 profiles show up. */}
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            popularProfiles.results.map((profile) => (
                <Profile key={profile.id} profile={profile} />
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

