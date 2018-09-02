// @flow
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { Cards } from "mdi-material-ui";

import "./styles.css";

type Props = {
  text: string
};

class EmptyMessage extends React.Component<Props> {
  static defaultProps = {
    text: "You have no flashcards. Tap the Add Button to create a new one."
  };

  render() {
    const { text } = this.props;

    return (
      <div className="emptyMessage">
        <Avatar
          classes={{
            root: "emptyMessageAvatar"
          }}
        >
          <Cards className="emptyMessageIcon" />
        </Avatar>
        <Typography align="center" color="textSecondary">
          You have no flashcards. Tap the Add Button to create a new set
        </Typography>
      </div>
    );
  }
}

export default EmptyMessage;
