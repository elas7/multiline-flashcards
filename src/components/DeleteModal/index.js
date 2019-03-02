// @flow
import * as React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Modal from "../Modal";

import styles from "./styles.module.css";

type ObjectType = "flashcard" | "set";

type Props = {
  type: ObjectType,
  title: string | null,
  open: boolean,
  onClose: Function,
  onDeleteConfirm: Function
};

export default function DeleteModal({
  type,
  title,
  open,
  onClose,
  onDeleteConfirm,
  ...otherProps
}: Props) {
  return (
    <Modal onClose={onClose} open={open} {...otherProps}>
      <React.Fragment>
        <Typography variant="subheading">
          Are you sure you want to delete the {type} {`"${title}"?`}
        </Typography>
        <div className={styles.modalButtonsContainer}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={onDeleteConfirm}>
            Delete
          </Button>
        </div>
      </React.Fragment>
    </Modal>
  );
}
