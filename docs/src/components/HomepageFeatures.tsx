/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./HomepageFeatures.module.css";
import Translate, { translate } from "@docusaurus/Translate";

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      description: "Feature 1 title",
      message: "Make it easy for users to report accessibility issues",
    }),
    image: "/img/feature1.svg",
    description: (
      <Translate
        values={{
          connectAccess: <span lang="en">Connect Access</span>,
        }}
        description="Feature 1 description"
      >
        {
          "{connectAccess} allows you to renew the dialogue with your users and follow the subject until the problem is resolved. Objective: to detect and respond to difficulties in gaining access to your digital services. This platform was designed to comply with data protection rules (GDPR)."
        }
      </Translate>
    ),
  },
  {
    title: translate({
      description: "Feature 2 title",
      message: "Accessibility at the heart of the project",
    }),
    image: "/img/feature2.svg",
    description: (
      <Translate
        values={{
          connectAccess: <span lang="en">Connect Access</span>,
        }}
        description="Feature 2 description"
      >
        {
          "{connectAccess} is a mediation platform that was designed with and for people with disabilities taking into account the accessibility standards (RGAA, WCAG, WAI-ARIA). In a logic of universal design, the accessibility of {connectAccess} is essential for some people, but useful for all."
        }
      </Translate>
    ),
  },
  {
    title: translate({
      description: "Feature 3 title",
      message: "Join the community",
    }),
    image: "/img/feature3.svg",
    description: (
      <Translate
        values={{
          license: (
            <a
              href={translate({
                description: "License URL",
                message: "https://www.gnu.org/licenses/why-affero-gpl.en.html",
              })}
            >
              AGPL3
            </a>
          ),
        }}
        description="Feature 3 description"
      >
        {
          "It is free software under {license} license. You can install it and contribute to it by developing new features, reporting bugs, offering translations or contributing your ideas. We use open source software like Django and React, pay attention to code quality, and drive development by tests (TDD)."
        }
      </Translate>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  const imageUrlWithBase = useBaseUrl(image);
  return (
    <li className={`col col--4 ${styles.featureListItem}`}>
      <div className="text--center">
        <img className={styles.featureSvg} alt="" src={imageUrlWithBase} />
      </div>
      <div className="text--center padding-horiz--md">
        <h2 className={styles.featureTitle}>{title}</h2>
        <p>{description}</p>
      </div>
    </li>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <ul className={`row ${styles.featureList}`}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </ul>
      </div>
    </section>
  );
}
