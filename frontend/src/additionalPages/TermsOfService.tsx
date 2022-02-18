/* eslint-disable jsx-a11y/heading-has-content */
import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import { useContactInformation } from "../hooks";
import { Langs } from "../types/types";

function TermsOfService() {
  const { contactInformation } = useContactInformation();
  const { i18n } = useLingui();
  return (
    <div className="terms-of-service page-base">
      <h1 className="page-base__title">
        <Trans>Terms of service</Trans>
      </h1>
      <div className="page-base__content terms-of-service__content">
        {contactInformation?.termsOfService && (
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a {...props} className="terms-of-service__link" />
              ),
              h1: ({ node, ...props }) => <h2 {..._.omit(props, ["level"])} />,
              h2: ({ node, ...props }) => <h3 {..._.omit(props, ["level"])} />,
              h3: ({ node, ...props }) => <h4 {..._.omit(props, ["level"])} />,
              h4: ({ node, ...props }) => <h5 {..._.omit(props, ["level"])} />,
              h5: ({ node, ...props }) => <h6 {..._.omit(props, ["level"])} />,
              h6: ({ node, ...props }) => (
                <div
                  {..._.omit(props, ["level"])}
                  role="heading"
                  aria-level={7}
                  className="terms-of-service__h7"
                />
              ),
            }}
          >
            {contactInformation.termsOfService[i18n.locale as Langs]}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default TermsOfService;
