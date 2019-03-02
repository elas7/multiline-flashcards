// @flow
import * as React from "react";
import cx from "classnames";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import styles from "./styles.module.css";

type Props = {
  children: React.Node,
  className: string,
  color: string
};

export default function Header({
  className = "",
  color = "primary",
  children
}: Props) {
  return (
    <AppBar
      className={cx(styles.appBar, className)}
      position="sticky"
      color={color}
    >
      <Toolbar className={styles.smallToolbar}>{children}</Toolbar>
    </AppBar>
  );
}
