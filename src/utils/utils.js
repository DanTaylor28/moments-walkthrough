 import { Accordion } from "react-bootstrap"
import { axiosReq } from "../api/axiosDefaults"

// This is going to be used for our infinitescroll component and will be able
// to be re-used for comments or posts etc thats why were calling it resource, setResource
// so it that can equate to post, setPost or comments, setComments etc
export const fetchMoreData = async (resource, setResource) => {
    try{
        // resource.next is a url to the next page of results from our api. if it exists of course!
        const {data} = await axiosReq.get(resource.next)
        setResource(prevResource => ({
            // we're spreading the prevResource so its still showing on the page
            ...prevResource,
            // link to the next page of results from page we just fetched.
            next:data.next,
            // we also need to update the results array to include the newly fetched results.
            // we do this using the reduce method..
            // initial value for accumulator is previous results.
            // we then need to use some() to check if any post id's in the new fetched data
            // matches an id that already exists in our prev results.
            // if some() finds a match, it will return the existing accumulator to the reduce method.
            // If it doesnt, then we know its a new post, so we can return our spread accumulator with 
            // the new post at the end.
            results: data.results.reduce((acc, cur) => {
                return acc.some(accResult => accResult.id === cur.id) ? acc : [...acc, cur]
            }, prevResource.results)

        }))
    } catch(err) {}
}