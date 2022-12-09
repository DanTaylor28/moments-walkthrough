import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../context/CurrentUserContext";
import Comment from "../comments/Comment";

function PostPage() {
  // used to access posts from the api
  // id is the one referenced in the route on App.js
  // we're setting the value of the use state to an empty array as thats easier
  // to continue using the same data-type whether youre requesting a single post or multiple
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        // the below code is first destructuring the data property returned from the api,
        // and renaming it to post. Its a good destructuring feature allowing us to give the
        // variable a more meaningful name.
        // promise.all() accepts an array of promises, and gets resolved when all promises are
        // resolved, returning an array of data. if any fail, it gets rejected with an error.
        // so far just the post is being returned, but later ill add comments too.
        // destructuring is now added here for comments also, named comments.
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
          // comments are now being requested here.
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        setPost({ results: [post] });
        // calling setComments function here now also we they can be displayed to users.
        setComments(comments);
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
        {/* I'm spreading the post object from the results array so that its key/value pairs
        are passsed in as props.
        setPosts will be used later to handle likes. */}
        {/* passing postPage here will evaluate to truthy, simply applying it without a value
        means it will be returned as true inside our post component. */}
        <Post {...post.results[0]} setPosts={setPost} postPage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            comments.results.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments.. yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;
