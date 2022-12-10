import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Post from "./Post";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function PostsPage({ message, filter = "" }) {
  // we want to store posts in a results array that will be empty to begin with
  // just like with PostPage component.
  const [posts, setPosts] = useState({ results: [] });
  // shows status off posts being requested. we can use this to show
  // a loading spinner while waiting for the request.
  const [hasLoaded, setHasLoaded] = useState(false);
  //   useLocation used to detect url changes as it will have to refetch posts if the
  //   user clicks between home, liked and feed pages.
  const { pathname } = useLocation();
// we're using setState to display corresponding search results from the search bar.
  const [query, setQuery] = useState("");


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // we are requesting the posts by the filter that we declared in the app.js filter value.
        // ie either by followed profiles/liked posts/everything.
        // i also added the search={query} to the request so it takes into account any search bar 
        // filters that the user makes.
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    // we have to set to false so the loading spinner will be shown to users while data is fetched.
    setHasLoaded(false);
    // I have moved the fetchPosts() call inside a timeout function so it waits 1 second after the user
    // stops typing a search before making a request to the api.
    // This stops the page flashing after each keystroke and is just better ux in general.
    const timer = setTimeout(() => {
        fetchPosts();
    }, 1000);
    return () => {
        clearTimeout(timer)
    }
    // so the fetchPosts code will run every time either filter or pathname values change.
    // Now query is also added, so it runs again if the user changes the search text!
  }, [filter, query, pathname]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles mobile</p>
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        {/* added onSubmit prevent default to stop the page automatically refreshing 
        if the user presses enter after a search. */}
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
        //   value is the query we defined above and to update that we'll call the setQuery 
        // with the events target value.
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search posts"
          />
        </Form>
        {hasLoaded ? (
          <>
            {posts.results.length ? (
                // downloaded using npm and autoimported here.
                <InfiniteScroll 
                // children prop will tell component which child components we want to render.
                    children={
                        // we just moved this code from down below into here because the mapped posts is
                        // what we want to render.
                        posts.results.map((post) => (
                            // setPosts is there so user can like and unlike the post.
                            <Post key={post.id} {...post} setPosts={setPosts} />
                          ))
                    }
                    // tells component how many posts are currently being displayed.
                    dataLength={posts.results.length}
                    loader={<Asset spinner />}
                    // tells the infinite scroll if there is more data to load on reaching bottom of current page.
                    // The value is the double not operator - basically saying if there is not a next page 
                    // value on our api then its false - kinda confusing but yhh..
                    hasMore={!!posts.next}
                    // next is a function to call if the above hasMore value equates to true.
                    // The function fetchMoreData has been declared in utils.js so we're calling that
                    // with (posts, setPosts)
                    next={() => fetchMoreData(posts, setPosts)}
                />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostsPage;
