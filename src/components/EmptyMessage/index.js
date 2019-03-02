// @flow
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { Cards } from "mdi-material-ui";

import styles from "./styles.module.css";

type Props = {
  text: string
};

export default function EmptyMessage({
  text = "You have no flashcards. Tap the Add Button to create a new one."
}: Props) {
  return (
    <div className={styles.emptyMessage}>
      <Avatar
        classes={{
          root: styles.emptyMessageAvatar
        }}
      >
        <Cards className={styles.emptyMessageIcon} />
      </Avatar>
      <Typography align="center" color="textSecondary">
        {text}
      </Typography>
    </div>
  );
}
