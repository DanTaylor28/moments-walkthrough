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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // we are requesting the posts by the filter that we declared in the app.js filter value.
        // ie either by followed profiles/liked posts/everything.
        const { data } = await axiosReq.get(`/posts/?${filter}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    // we have to set to false so the loading spinner will be shown to users while data is fetched.
    setHasLoaded(false);
    fetchPosts();
    // so the fetchPosts code will run every time either filter or pathname values change.
  }, [filter, pathname]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles mobile</p>
        {hasLoaded ? (
          <>
            {posts.results.length ? (
              posts.results.map((post) => (
                // setPosts is there so user can like and unlike the post.
                <Post key={post.id} {...post} setPosts={setPosts} />
              ))
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
        <p>Popular profiles for desktop</p>
      </Col>
    </Row>
  );
}

export default PostsPage;
