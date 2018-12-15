// @flow
import * as React from "react";
import { withRouter } from "react-router";
import { withLastLocation } from "react-router-last-location";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";

import { goBack } from "../../utils";

type Props = {
  className: string,
  parentURL: string,
  history: Object,
  lastLocation: Object | null
};

class BackButton extends React.Component<Props> {
  static defaultProps = {
    className: "",
    parentURL: "/"
  };

  componentDidMount() {
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  goBack = () => {
    const { history, lastLocation, parentURL } = this.props;

    goBack(history, lastLocation, parentURL);
  };

  handleKeyUp = event => {
    // "Click" if ALT + ArrowLeft is pressed
    if (event.shiftKey && event.key === "ArrowLeft") {
      this.goBack();
    }
  };

  handleClick = () => this.goBack();

  render() {
    const { className } = this.props;

    return (
      <IconButton
        className={className}
        color="inherit"
        onClick={this.handleClick}
      >
        <ArrowBack />
      </IconButton>
    );
  }
}

export default withLastLocation(withRouter(BackButton));
