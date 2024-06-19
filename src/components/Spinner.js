import React from "react";
import { ClimbingBoxLoader } from "react-spinners";

/**
 * Spinner component for displaying a loading spinner.
 */
const Spinner = () => (
  <div className="loading">
    Processing...
    <ClimbingBoxLoader color="white" />
  </div>
);

export default Spinner;
