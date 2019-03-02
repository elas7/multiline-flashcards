// @flow
import React, { useEffect } from "react";
import { withRouter } from "react-router";
import { withLastLocation } from "react-router-last-location";

import { goBack } from "../../utils";

type Props = {
  parentURL: string,
  history: Object,
  lastLocation: Object | null
};

/**
 * Navigates back (hierarchically) in the app
 */
function GoBack({ parentURL = "/", history, lastLocation }: Props) {
  useEffect(() => {
    goBack(history, lastLocation, parentURL);
  });
}

export default withLastLocation(withRouter(GoBack));
