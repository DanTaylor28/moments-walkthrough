import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "../../context/CurrentUserContext";
import NavBar from "../NavBar";

test("renders navbar", () => {
  render(
    <Router>
      <NavBar />
    </Router>
  );
  // screen.debug prints out the html to the terminal, helping you to debug any failed tests.
  //   screen.debug();
  const signInLink = screen.getByRole("link", { name: "Sign In" });
  expect(signInLink).toBeInTheDocument();
});

test("renders link to user profile for logged in user", async () => {
  render(
    <Router>
      <CurrentUserProvider>
        <NavBar />
      </CurrentUserProvider>
    </Router>
  );

  const profileAvatar = await screen.findByText('Profile')
  expect(profileAvatar).toBeInTheDocument()
});


test("renders sign in & signup buttons again on sign out", async () => {
    render(
      <Router>
        <CurrentUserProvider>
          <NavBar />
        </CurrentUserProvider>
      </Router>
    );
  
    const signOutLink = await screen.findByRole('link', {name: 'Sign Out'})
    fireEvent.click(signOutLink)
    const signInLink = await screen.findByRole('link', {name: 'Sign In'})
    const signUpLink = await screen.findByRole('link', {name: 'Sign Up'})
    expect(signInLink).toBeInTheDocument()
    expect(signUpLink).toBeInTheDocument()
  });