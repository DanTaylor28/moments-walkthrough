import React from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentUser } from "../../context/CurrentUserContext";
import styles from "../../styles/Comment.module.css";

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setPost,
    setComments,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
        // Attempt to delete the comment with its id using the delete request
        await axiosRes.delete(`/comments/${id}`);
        // show updated comments_count array depreceated by 1 
        setPost(prevPost => ({
            results: [{
                ...prevPost.results[0],
                comments_count: prevPost.results[0].comments_count - 1
            }]
        }))
        // filter out the deleted comment from the existing results array.
        setComments(prevComments => ({
            ...prevComments,
            results: prevComments.results.filter((comment) => comment.id !== id),
        }))
    } catch(err) {
        console.log(err)
    }
  }

  return (
    <div>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          <p>{content}</p>
        </Media.Body>
        {is_owner && (
          <MoreDropdown handleEdit={() => {}} handleDelete={handleDelete} />
        )}
      </Media>
    </div>
  );
};

export default Comment;
