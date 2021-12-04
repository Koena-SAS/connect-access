import React from "react";
import type { ConfigData } from "../types/types";

/**
 * Configuration data set with DATA_* environment variables.
 */
const ConfigDataContext = React.createContext<ConfigData>({
  platformName: "",
  logoFilename: "",
  logoFilenameSmall: "",
});

export default ConfigDataContext;
