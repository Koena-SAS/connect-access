import { t } from "@lingui/macro";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { PATHS } from "../../constants/paths";
import { ConfigData } from "../../constants/types";
import ConfigDataContext from "../../contexts/configData";
import Tabs from "../../forms/Tabs";
import { useAdminTraceReports, useWindowDimensions } from "../../hooks";
import Breadcrumbs from "../Breadcrumbs";
import RequestDetail from "./RequestDetail";
import TraceReports from "./TraceReports";

/**
 * Contains access to mediation request detail, action history and trace reports.
 */
function RequestDetailContainer({ token }) {
  const configData = useContext<ConfigData>(ConfigDataContext);
  useAdminTraceReports(token);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const { width: windowWidth } = useWindowDimensions();
  const isTablistVertical = Boolean(windowWidth <= 500);
  const tabsInfos = [
    {
      element: <RequestDetail token={token} setBreadcrumbs={setBreadcrumbs} />,
      pageTitle: t`${configData.platformName} - Detail of the mediation request`,
      label: t`Request details`,
      path: PATHS.ADMIN_REQUEST_DETAIL,
    },
    {
      element: <TraceReports token={token} setBreadcrumbs={setBreadcrumbs} />,
      pageTitle: t`${configData.platformName} - Trace reports of the mediation request`,
      label: t`Trace reports`,
      path: PATHS.ADMIN_TRACE_REPORTS,
    },
  ];
  return (
    <div className="admin-request-detail-container admin-page-base">
      <Breadcrumbs
        items={breadcrumbs}
        className="admin-request-detail-container__breadcrumbs"
        widthToChangeOrientation={500}
      />
      <Tabs
        tabsInfos={tabsInfos}
        label={t`Views for a particular mediation request`}
        className="admin-request-detail-container__tabs page-base__content"
        orientation={isTablistVertical ? "vertical" : "horizontal"}
      />
    </div>
  );
}

RequestDetailContainer.propTypes = {
  token: PropTypes.string,
};

export default RequestDetailContainer;
