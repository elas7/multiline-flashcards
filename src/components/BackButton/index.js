// @flow
import * as React from "react";
import { withRouter } from "react-router";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";

type Props = {
  className: string,
  history: Object
};

class BackButton extends React.Component<Props> {
  static defaultProps = {
    className: ""
  };

  render() {
    const { className } = this.props;

    return (
      <IconButton
        className={className}
        color="inherit"
        onClick={() => this.props.history.goBack()}
      >
        <ArrowBack />
      </IconButton>
    );
  }
}

export default withRouter(BackButton);
