// @flow
import React, { useEffect } from "react";
import { withRouter } from "react-router";
import { withLastLocation } from "react-router-last-location";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";

import useKey from "../../hooks/useKey";
import { goBack } from "../../utils";

type Props = {
  className: string,
  parentURL: string,
  history: Object,
  lastLocation: Object | null
};

function BackButton({
  className = "",
  parentURL = "/",
  history,
  lastLocation
}: Props) {
  const handleGoBack = () => {
    goBack(history, lastLocation, parentURL);
  };

  useKey([["Shift", "ArrowLeft"]], handleGoBack);

  return (
    <IconButton className={className} color="inherit" onClick={handleGoBack}>
      <ArrowBack />
    </IconButton>
  );
}

export default withLastLocation(withRouter(BackButton));
