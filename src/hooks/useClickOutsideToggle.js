import { useEffect, useRef, useState } from "react";

const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false);
  // instantiating a ref variable that will hold a reference to the burger icon.
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // current variable is stored in the ref cause i assigned it to the toggle button.
      // we're checking if it has a variable cause it was originally set to null above.
      // Then we're checking if the user has clicked away from the referenced button.
      if (ref.current && !ref.current.contains(event.target)) {
        // if they have, we call setExpanded to false which closes the burger menu.
        setExpanded(false);
      }
    };
    // add mouseup event listener with callback calling the function
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      // inside return statement cleanup function, we're removing the event listener.
      // even though the navbar wont be unmounted its still good practise to remove listeners.
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);

  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;
