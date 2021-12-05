import { generatePath, useParams } from "react-router-dom";

/**
 * Compute a path from the given path with parameters and the existing organization
 * prefix parameters in react router.
 * @returns function taking the path without params and computing the generated path.
 */
function useGeneratePrefixedPath() {
  const { organizationSlug, applicationSlug, requestId } = useParams<{
    organizationSlug: string;
    applicationSlug: string;
    requestId: string;
  }>();
  const generatePrefixedPath = (path: string): string => {
    return generatePath(path, {
      organizationSlug,
      applicationSlug,
      requestId,
    });
  };
  return generatePrefixedPath;
}

export default useGeneratePrefixedPath;
