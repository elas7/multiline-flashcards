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

  componentDidMount() {
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyUp = event => {
    // "Click" if ALT + ArrowLeft is pressed
    if (event.shiftKey && event.key === "ArrowLeft") {
      this.props.history.goBack();
    }
  };

  handleClick = () => this.props.history.goBack();

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

export default withRouter(BackButton);
