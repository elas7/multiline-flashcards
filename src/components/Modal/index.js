// @flow
import * as React from "react";
import cx from "classnames";
import MaterialUIModal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";

import "./styles.css";

type Props = {
  children: React.Node,
  className: string,

  // props used by material-ui's Modal component
  open: boolean,
  onClose: Function
};

class Modal extends React.Component<Props> {
  static defaultProps = {
    className: "",
    open: true
  };

  render() {
    const { children, className, onClose, open, ...otherProps } = this.props;

    return (
      <MaterialUIModal onClose={onClose} open={open} {...otherProps}>
        <Paper className={cx("modal", className)}>{children}</Paper>
      </MaterialUIModal>
    );
  }
}

export default Modal;
