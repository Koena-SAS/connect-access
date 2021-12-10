import { useEffect } from "react";

type PageProps = {
  title: string;
  children: JSX.Element | false;
};

/**
 * This component changes the title of the document.
 * It should be used when changing the displayed page.
 */
const Page = ({ title, children }: PageProps): JSX.Element => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return children ? children : <></>;
};

export default Page;
