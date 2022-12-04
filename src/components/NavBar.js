import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../context/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
  const currentUser = useCurrentUser();
  // defining setcurrentuser thats used below in the handle signout function
  const setCurrentUser = useSetCurrentUser();

  // burger menu expansion - initial value false because the menu will be collapsed originally
  // const [expanded, setExpanded] = useState(false);
  // // instantiating a ref variable that will hold a reference to the burger icon.
  // const ref = useRef(null);
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // current variable is stored in the ref cause i assigned it to the toggle button.
  //     // we're checking if it has a variable cause it was originally set to null above.
  //     // Then we're checking if the user has clicked away from the referenced button.
  //     if (ref.current && !ref.current.contains(event.target)){
  //       // if they have, we call setExpanded to false which closes the burger menu.
  //       setExpanded(false)
  //     }
  //   }
  //   // add mouseup event listener with callback calling the function
  //   document.addEventListener('mouseup', handleClickOutside)
  //   return () => {
  //     // inside return statement cleanup function, we're removing the event listener.
  //     // even though the navbar wont be unmounted its still good practise to remove listeners.
  //     document.removeEventListener('mouseup', handleClickOutside)
  //   }
  // }, [ref])

  // All of the commented out code above has been refactored into its own file - 
  // useClickOutsideToggle.js. Its exactly the same code just being imported into the file below..
  // The function is destructured and called.
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    // function to handle sign out or log errors to console if applicable
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };
  // variables storing the applicable navigation links for logged in or logged out status
  // these are inserted into the code below depending on whether there is a current user or not.
  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="fas fa-plus-square"></i>Add Post
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i className="fas fa-heart"></i>Liked
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to="/"
        // calling the handlesignout function defined above
        onClick={handleSignOut}
      >
        <i className="fas fa-sign-out-alt"></i>Sign Out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>
    </>
  );
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign In
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signup"
      >
        <i className="fas fa-user-plus"></i>Sign Up
      </NavLink>
    </>
  );

  return (
    // iv set expanded with the expanded value from the UseState hook at top of file.
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45px" />
          </Navbar.Brand>
        </NavLink>
        {/* will only show the addPostIcon if currentUser exists */}
        {currentUser && addPostIcon}
        {/* Onclick changes state of expanded to opposite when clicked ie same as what bootstrap
        automatically does. We have to declare this for our clickaway functionality we are implementing */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          // allows me to reference this dom element, and detect whether the user clicked inside or outside of it.
          // its also defined above const ref = useRef etc
          ref={ref}
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </NavLink>
            {/* the conditional statement inserting in the relevant nav links */}
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
