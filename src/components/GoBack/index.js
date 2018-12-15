// @flow
import * as React from "react";
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
class GoBack extends React.Component<Props> {
  static defaultProps = {
    parentURL: "/"
  };

  goBack = () => {
    const { history, lastLocation, parentURL } = this.props;

    goBack(history, lastLocation, parentURL);
  };

  componentDidMount() {
    this.goBack();
  }

  render() {
    return null;
  }
}

export default withLastLocation(withRouter(GoBack));
