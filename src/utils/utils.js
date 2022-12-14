import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";

// This is going to be used for our infinitescroll component and will be able
// to be re-used for comments or posts etc thats why were calling it resource, setResource
// so it that can equate to post, setPost or comments, setComments etc
export const fetchMoreData = async (resource, setResource) => {
  try {
    // resource.next is a url to the next page of results from our api. if it exists of course!
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      // we're spreading the prevResource so its still showing on the page
      ...prevResource,
      // link to the next page of results from page we just fetched.
      next: data.next,
      // we also need to update the results array to include the newly fetched results.
      // we do this using the reduce method..
      // initial value for accumulator is previous results.
      // we then need to use some() to check if any post id's in the new fetched data
      // matches an id that already exists in our prev results.
      // if some() finds a match, it will return the existing accumulator to the reduce method.
      // If it doesnt, then we know its a new post, so we can return our spread accumulator with
      // the new post at the end.
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {}
};

export const followHelper = (profile, clickedProfile, following_id) => {
  return profile.id === clickedProfile.id
    ? //  this is the profile i clicked on,
      // update its followers count and set its following id
      {
        ...profile,
        followers_count: profile.followers_count + 1,
        following_id,
      }
    : profile.is_owner
    ? //  this is the profile of the logged in user
      // update its following count
      { ...profile, following_count: profile.following_count + 1 }
    : //  the is not the profile the user clicked on or the profile
      // the user owns, so just return it unchanged.
      profile;
};

export const unfollowHelper = (profile, clickedProfile) => {
  return profile.id === clickedProfile.id
    ? //  this is the profile i clicked on,
      // update its followers count and set its following id
      {
        ...profile,
        followers_count: profile.followers_count - 1,
        following_id: null,
      }
    : profile.is_owner
    ? //  this is the profile of the logged in user
      // update its following count
      { ...profile, following_count: profile.following_count - 1 }
    : //  the is not the profile the user clicked on or the profile
      // the user owns, so just return it unchanged.
      profile;
};

export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};
