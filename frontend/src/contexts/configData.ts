import React from "react";
import type { ConfigData } from "../constants/types";

/**
 * Configuration data set with DATA_* environment variables.
 */
const ConfigDataContext = React.createContext<ConfigData>({ platformName: "" });

export default ConfigDataContext;
