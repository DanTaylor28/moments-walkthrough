import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PostPage() {
  // used to access posts from the api
  // id is the one referenced in the route on App.js
  // we're setting the value of the use state to an empty array as thats easier
  // to continue using the same data-type whether youre requesting a single post or multiple
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        // the below code is first destructuring the data property returned from the api,
        // and renaming it to post. Its a good destructuring feature allowing us to give the
        // variable a more meaningful name.
        // promise.all() accepts an array of promises, and gets resolved when all promises are
        // resolved, returning an array of data. if any fail, it gets rejected with an error.
        // so far jus tthe post is being returned, but later ill add comments too.
        const [{ data: post }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
        ]);
        setPost({ results: [post] });
        console.log(post);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
    // runs this code every time the post id in the url changes!
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        <p>Post component</p>
        <Container className={appStyles.Content}>Comments</Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;