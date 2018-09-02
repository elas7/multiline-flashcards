// @flow
import * as React from "react";
import cx from "classnames";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import "./styles.css";

type Props = {
  children: React.Node,
  className: string,
  color: string
};

class Header extends React.Component<Props> {
  static defaultProps = {
    className: "",
    color: "primary"
  };

  render() {
    const { children, className, color } = this.props;

    return (
      <AppBar
        className={cx("appBar", className)}
        position="sticky"
        color={color}
      >
        <Toolbar className="smallToolbar">{children}</Toolbar>
      </AppBar>
    );
  }
}

export default Header;
