import { t, Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import { generatePath, Link, useParams } from "react-router-dom";
import { statusMap } from "../constants/choicesMap";
import Button from "../forms/buttons/Button";
import Table from "../forms/Table";
import type { MediationRequest } from "../types/mediationRequest";

type MediationRequestsListProps = {
  mediationRequests: MediationRequest[];
  /**
   * The path to get the mediation request detail pages.
   */
  detailsPath: string;
};

/**
 * List mediation requests within a table.
 */
function MediationRequestsList({
  mediationRequests,
  detailsPath,
}: MediationRequestsListProps) {
  const { organizationSlug, applicationSlug } =
    useParams<{ organizationSlug: string; applicationSlug: string }>();
  const { i18n } = useLingui();

  const headsInfos = [
    { text: t`Date` },
    { text: t`Organization` },
    { text: t`Problem Description` },
    { text: t`Status` },
    { text: t`Identifier` },
    { text: t`Details` },
  ];
  const rowsInfos = mediationRequests.map((request) => {
    const requestDate = new Date(request.requestDate ? request.requestDate : 0);
    const requestId = request.id ? request.id.substring(0, 8) : "Unknown ID";
    return {
      key: request.id ? request.id : "undefined",
      infos: [
        { text: requestDate.toLocaleString(i18n.locale) },
        { text: request.organizationName },
        { text: request.issueDescription },
        {
          text: <Trans id={statusMap[request.status]} />,
        },
        {
          text: requestId,
        },
        {
          text: (
            <>
              {" "}
              <Button
                size="small"
                component={Link}
                to={generatePath(detailsPath, {
                  requestId: request.id,
                  organizationSlug,
                  applicationSlug,
                })}
                startIcon={<ZoomInIcon />}
              >
                <Trans>
                  Details<span className="sr-only">: {requestId}</span>
                </Trans>
              </Button>
            </>
          ),
        },
      ],
    };
  });

  return (
    <Table
      captionText={t`Your mediation requests' list sorted by date (the most recent first)`}
      className="admin-trace-reports"
      headsInfos={headsInfos}
      rowsInfos={rowsInfos}
    />
  );
}

export default MediationRequestsList;
