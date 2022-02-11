import ReactMarkdown from "react-markdown";

jest.mock(
  "react-markdown",
  () =>
    ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    }
);

export const mockedReactMarkdown = ReactMarkdown as jest.Mocked<
  typeof ReactMarkdown
>;
