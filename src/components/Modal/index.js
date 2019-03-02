// @flow
import * as React from "react";
import cx from "classnames";
import MaterialUIModal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";

import styles from "./styles.module.css";

type Props = {
  children: React.Node,
  className: string,

  // props used by material-ui's Modal component
  open: boolean,
  onClose: Function
};

export default function Modal({
  children,
  className = "",

  // props used by material-ui's Modal component
  open = true,
  onClose,
  ...otherProps
}: Props) {
  return (
    <MaterialUIModal onClose={onClose} open={open} {...otherProps}>
      <Paper className={cx(styles.modal, className)}>{children}</Paper>
    </MaterialUIModal>
  );
}
