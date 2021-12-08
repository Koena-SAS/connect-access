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
      message: "Easy to Use",
    }),
    image: "/img/undraw_docusaurus_mountain.svg",
    description: (
      <Translate description="Feature 1 description">
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </Translate>
    ),
  },
  {
    title: translate({
      description: "Feature 2 title",
      message: "Focus on What Matters",
    }),
    image: "/img/undraw_docusaurus_tree.svg",
    description: (
      <Translate
        values={{ docs: <code>docs</code> }}
        description="Feature 2 description"
      >
        {
          "Docusaurus lets you focus on your docs, and we'll do the chores. Go ahead and move your docs into the {docs} directory."
        }
      </Translate>
    ),
  },
  {
    title: translate({
      description: "Feature 3 title",
      message: "Powered by React",
    }),
    image: "/img/undraw_docusaurus_react.svg",
    description: (
      <Translate description="Feature 3 description">
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
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
