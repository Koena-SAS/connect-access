import PropTypes from "prop-types";
import { useEffect } from "react";

/**
 * This component changes the title of the document.
 * It should be used when changing the displayed page.
 */
const Page = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return children ? children : null;
};

Page.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Page;
