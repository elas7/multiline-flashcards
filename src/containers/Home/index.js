// @flow
import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import { Cards } from "mdi-material-ui";

import { deleteFlashcard } from "../../modules/flashcards";
import { Set } from "../../types";
import Header from "../../components/Header";
import EmptyMessage from "../../components/EmptyMessage";
import { maybePluralize } from "../../utils";

import MainMenu from "./MainMenu";
import styles from "./styles.module.css";

type Props = {
  sets: Set[],
  history: Object
};

type State = {
  // Id of Flashcard to show in Delete modal, if any
  deleteModalFlashcardId: number | null
};

class Home extends React.Component<Props, State> {
  static defaultProps = {
    sets: []
  };

  state = {
    deleteModalFlashcardId: null
  };

  handleSetClick = index => {
    const { history } = this.props;

    history.push(`/sets/${index + 1}`);
  };

  render() {
    const { sets } = this.props;

    const hasSets = sets.length !== 0;

    return (
      <React.Fragment>
        <Header>
          <Typography
            variant="headline"
            color="inherit"
            className={styles.appBarTitle}
          >
            Multiline Flashcards
          </Typography>
          <MainMenu />
        </Header>
        <div className={styles.textsContainer} id="scrollingElement">
          {hasSets ? (
            <React.Fragment>
              <Typography variant="title" className={styles.content}>
                Sets
              </Typography>
              <List disablePadding>
                {sets.map(({ title, flashcards }, index) => {
                  return (
                    <ListItem
                      button
                      key={index}
                      onClick={() => this.handleSetClick(index)}
                    >
                      <Avatar>
                        <Cards />
                      </Avatar>
                      <ListItemText
                        primary={title}
                        secondary={maybePluralize(
                          flashcards.length,
                          "flashcard"
                        )}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </React.Fragment>
          ) : (
            <EmptyMessage
              text={
                "You have no flashcards. Tap the Add Button to create a new set"
              }
            />
          )}
          <Fab
            className={styles.addButton}
            component={Link}
            to="/sets/new"
            color="secondary"
          >
            <AddIcon />
          </Fab>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      sets: state.flashcards.sets
    }),
    dispatch => ({
      deleteFlashcard: index => dispatch(deleteFlashcard(index))
    })
  )(Home)
);
