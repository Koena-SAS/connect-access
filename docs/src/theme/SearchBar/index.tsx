/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef, useState, useEffect } from "react";
import classnames from "classnames";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import { translate } from "@docusaurus/Translate";
import { DocusaurusConfig } from "@docusaurus/types";

const Search = (props) => {
  const initialized = useRef(false);
  const [indexReady, setIndexReady] = useState(false);
  const history = useHistory();
  const { siteConfig = {} as DocusaurusConfig } = useDocusaurusContext();
  const { baseUrl } = siteConfig;
  const initAlgolia = (searchDocs, searchIndex, DocSearch) => {
    new DocSearch({
      searchDocs,
      searchIndex,
      inputSelector: "#search_input_react",
      // Override algolia's default selection event, allowing us to do client-side
      // navigation and avoiding a full page refresh.
      handleSelected: (_input, _event, suggestion) => {
        const url = baseUrl + suggestion.url;
        // Use an anchor tag to parse the absolute url into a relative url
        // Alternatively, we can use new URL(suggestion.url) but its not supported in IE
        const a = document.createElement("a");
        a.href = url;
        // Algolia use closest parent element id #__docusaurus when a h1 page title does not have an id
        // So, we can safely remove it. See https://github.com/facebook/docusaurus/issues/1828 for more details.

        history.push(url);
      },
    });
  };

  type SearchData = {
    fileNames: {
      searchDoc: string;
      lunrIndex: string;
    };
  };

  function isSearchData(searchData: any): searchData is SearchData {
    return (
      searchData?.fileNames?.searchDoc !== undefined &&
      searchData?.fileNames?.lunrIndex !== undefined
    );
  }

  const pluginData = usePluginData("docusaurus-lunr-search");
  if (!isSearchData(pluginData)) {
    throw new Error(`Lunyr plugin search data is inconsistent: ${pluginData}`);
  }
  const getSearchDoc = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${baseUrl}${pluginData.fileNames.searchDoc}`).then((content) =>
          content.json()
        )
      : Promise.resolve([]);

  const getLunrIndex = () =>
    process.env.NODE_ENV === "production"
      ? fetch(`${baseUrl}${pluginData.fileNames.lunrIndex}`).then((content) =>
          content.json()
        )
      : Promise.resolve([]);

  const loadAlgolia = () => {
    if (!initialized.current) {
      Promise.all([
        getSearchDoc(),
        getLunrIndex(),
        import("./lib/DocSearch"),
        import("./algolia.css"),
      ]).then(([searchDocs, searchIndex, { default: DocSearch }]) => {
        if (searchDocs.length === 0) {
          return;
        }
        initAlgolia(searchDocs, searchIndex, DocSearch);
        setIndexReady(true);
      });
      initialized.current = true;
    }
  };

  useEffect(function loadSearch() {
    loadAlgolia();
  }, []);

  return (
    <div className="navbar__search" key="search-box">
      <input
        id="search_input_react"
        type="search"
        placeholder={
          indexReady
            ? translate({
                description: "The search label",
                message: "General search",
              })
            : translate({
                description: "General search loading",
                message: "Loading...",
              })
        }
        aria-label={translate({
          description: "The search label",
          message: "General search",
        })}
        className={classnames(
          "navbar__search-input",
          { "search-bar-expanded": props.isSearchBarExpanded },
          { "search-bar": !props.isSearchBarExpanded }
        )}
        onClick={loadAlgolia}
        onMouseOver={loadAlgolia}
        onFocus={loadAlgolia}
        onBlur={loadAlgolia}
        disabled={!indexReady}
      />
    </div>
  );
};

export default Search;
