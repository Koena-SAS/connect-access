import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import MUITabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useGeneratePrefixedPath } from "../hooks";
import Page from "../Page";

type TabsProps = {
  /**
   * Array of information about each tab and associated displayed blocks.
   */
  tabsInfos: {
    element: any;
    pageTitle: string;
    label: string;
    path: string;
  }[];
  /**
   * Defines the aria-label for the main tabs element.
   */
  label: string;
  /**
   * Whether the first tabbable element should get the focus.
   */
  shouldFocus?: boolean;
  className?: string;
  [rest: string]: any;
};

/**
 * Display tabs to change between several displayed blocks.
 * It changes also the path.
 *
 * The rest of the parameters are forwarded to the Material UI Tabs.
 */
function Tabs({
  tabsInfos,
  label,
  shouldFocus = false,
  className,
  ...rest
}: TabsProps) {
  const history = useHistory();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(0);
  const generatePrefixedPath = useGeneratePrefixedPath();
  let firstCurrentTab = 0;
  for (let i = 0; i < tabsInfos.length; i++) {
    if (location.pathname === generatePrefixedPath(tabsInfos[i].path)) {
      firstCurrentTab = i;
    }
  }
  useEffect(() => {
    tabsInfos.forEach(function chooseCurrentTab(tabInfos, index) {
      const isCorrespondingPage =
        location.pathname === generatePrefixedPath(tabInfos.path);
      if (isCorrespondingPage) {
        setCurrentTab(index);
        return;
      }
    });
  }, [location.pathname, generatePrefixedPath, tabsInfos]);

  const firstTabbableElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (shouldFocus) {
      firstTabbableElement.current.focus();
    }
  }, [shouldFocus]);

  const handleChangeTab = (event, newValue) => {
    let stateObject = {};
    if (location.state && "from" in location.state) {
      stateObject = {
        from: location.state.from,
      };
    }
    if (newValue === 0) {
      history.push({
        pathname: generatePrefixedPath(tabsInfos[newValue].path),
        state: {
          from: location.state.from,
        },
      });
    } else {
      history.push({
        pathname: generatePrefixedPath(tabsInfos[newValue].path),
        state: stateObject,
      });
    }
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }
  return (
    <div className={className}>
      <AppBar position="static" color="default">
        <MUITabs
          value={currentTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label={label}
          {...rest}
        >
          {tabsInfos.map((tabInfos, index) => {
            return (
              <Tab
                label={tabInfos.label}
                {...a11yProps(index)}
                key={tabInfos.label}
                ref={firstCurrentTab === index ? firstTabbableElement : null}
              />
            );
          })}
        </MUITabs>
      </AppBar>
      {tabsInfos.map((tabInfos, index) => {
        return (
          <TabPanel value={currentTab} index={index} key={tabInfos.label}>
            <Page title={tabInfos.pageTitle}>{tabInfos.element}</Page>
          </TabPanel>
        );
      })}
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default Tabs;
