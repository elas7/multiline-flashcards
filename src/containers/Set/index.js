// @flow
import * as React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import ModeEditIcon from "@material-ui/icons/ModeEdit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Dice5 } from "mdi-material-ui";

import BackButton from "../../components/BackButton";
import { deleteFlashcard, updateSetTitle } from "../../modules/flashcards";
import { Flashcard } from "../../types";
import Header from "../../components/Header";
import EmptyMessage from "../../components/EmptyMessage";
import { maybePluralize, getRandomIntInclusive } from "../../utils";
import DeleteSetModal from "./DeleteSetModal";
import DeleteFlashcardModal from "./DeleteFlashcardModal";
import "./styles.css";

type Props = {
  flashcards: Flashcard[],
  deleteFlashcard: Function,
  deleteSet: Function,
  history: Object,
  match: Object
};

type State = {
  // Id of Flashcard to show in Delete modal, if any
  deleteModalFlashcardId: number | null,
  // Id of Set to show in Delete modal, if any
  deleteModalSetId: number | null,
  // true if the title set is being edited
  editingTitle: boolean,
  // title being edited
  title: string
};

class Set extends React.Component<Props, State> {
  static defaultProps = {
    flashcards: []
  };

  state = {
    deleteModalFlashcardId: null,
    deleteModalSetId: null,
    editingTitle: false,
    title: this.props.set.title
  };

  componentDidMount() {
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyUp = event => {
    // "Click" random when "r" is pressed
    if (event.key === "r") {
      this.handleRandomClick();
    }
  };

  handleDeleteSetClick = () => {
    const {
      match: {
        params: { setId }
      }
    } = this.props;

    this.setState({ deleteModalSetId: setId });
  };

  handleDeleteButtonClick = flashcardIndex => {
    this.setState({ deleteModalFlashcardId: flashcardIndex });
  };

  handleDeleteSetModalClose = () => {
    this.setState({ deleteModalSetId: null });
  };

  handleDeleteFlashcardModalClose = () => {
    this.setState({ deleteModalFlashcardId: null });
  };

  handleSetDeleteSuccess = () => {
    const { history } = this.props;

    history.push(`/`);
  };

  handleFlashcardDeleteSuccess = () => {
    this.setState({ deleteModalFlashcardId: null });
  };

  handleFlashcardClick = index => {
    const {
      history,
      match: {
        params: { setId }
      }
    } = this.props;

    history.push(`/sets/${setId}/flashcards/${index + 1}/practice`);
  };

  handleEditTitleClick = () => {
    this.setState(state => ({
      editingTitle: !state.editingTitle
    }));
  };

  handleTitleChange = event => {
    const value = event.target.value;

    this.setState({
      title: value
    });
  };

  handleRandomClick = () => {
    const {
      history,
      set: { flashcards },
      match: {
        params: { setId }
      }
    } = this.props;

    if (flashcards.length <= 1) {
      return;
    }

    const randomFlashcardIndex = getRandomIntInclusive(
      0,
      flashcards.length - 1
    );

    history.push(
      `/sets/${setId}/flashcards/${randomFlashcardIndex + 1}/practice`
    );
  };

  handleTitleSubmit = event => {
    event.preventDefault();
    this.maybeSaveTitle();
  };

  maybeSaveTitle = () => {
    const { title } = this.state;
    const {
      match: {
        params: { setId }
      },
      set: { title: oldTitle }
    } = this.props;

    if (title !== oldTitle && title.trim()) {
      this.props.updateSetTitle(Number(setId) - 1, title);
    }

    this.setState({
      title: title,
      editingTitle: false
    });
  };

  render() {
    const {
      set,
      match: {
        params: { setId }
      }
    } = this.props;
    const {
      deleteModalFlashcardId,
      deleteModalSetId,
      editingTitle,
      title
    } = this.state;

    if (!set) {
      return <Redirect push to="/" />;
    }

    const flashcards = set.flashcards;
    const hasFlashcards = flashcards.length !== 0;

    return (
      <React.Fragment>
        <DeleteSetModal
          id={deleteModalSetId}
          onClose={this.handleDeleteSetModalClose}
          onDeleteSuccess={this.handleSetDeleteSuccess}
        />
        <DeleteFlashcardModal
          id={deleteModalFlashcardId}
          setId={setId}
          onClose={this.handleDeleteFlashcardModalClose}
          onDeleteSuccess={this.handleFlashcardDeleteSuccess}
        />
        <Header>
          <BackButton className="menuIconLeft" />
          <Typography
            variant="headline"
            color="inherit"
            className="appBarTitle"
          >
            Set
          </Typography>
          <IconButton
            className="menuIcon"
            color="inherit"
            onClick={this.handleDeleteSetClick}
          >
            <DeleteIcon />
          </IconButton>
        </Header>
        <div className="setInfo">
          <div className="titleContainer">
            {editingTitle ? (
              <form onSubmit={this.handleTitleSubmit}>
                <TextField
                  autoFocus
                  label="Title"
                  onChange={this.handleTitleChange}
                  onBlur={this.maybeSaveTitle}
                  value={title}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                />
              </form>
            ) : (
              <Typography variant="title">{set.title}</Typography>
            )}
            <IconButton
              color={editingTitle ? "primary" : "inherit"}
              onClick={this.handleEditTitleClick}
              classes={{ root: "editTitleButton" }}
            >
              <ModeEditIcon />
            </IconButton>
          </div>
          <Typography variant="subheading" color="textSecondary">
            {maybePluralize(flashcards.length, "flashcard")}
          </Typography>
          {hasFlashcards && (
            <div className="setButtonContainer">
              <Button
                disabled={flashcards.length <= 1}
                variant="contained"
                color="secondary"
                size="small"
                onClick={this.handleRandomClick}
              >
                Random
                <Dice5 className="iconRight" />
              </Button>
            </div>
          )}
        </div>
        <Divider />
        <div className="textsContainer" id="scrollingElement">
          {hasFlashcards ? (
            <List disablePadding>
              {flashcards.map(({ title }, index) => {
                return (
                  <ListItem
                    button
                    key={index}
                    onClick={() => this.handleFlashcardClick(index)}
                  >
                    <ListItemText primary={title} />
                    <IconButton
                      onClick={event => {
                        event.stopPropagation();
                      }}
                      component={Link}
                      to={`/sets/${setId}/flashcards/${index + 1}/edit`}
                    >
                      <ModeEditIcon />
                    </IconButton>

                    <IconButton
                      onClick={event => {
                        event.stopPropagation();
                        this.handleDeleteButtonClick(index);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <EmptyMessage />
          )}
          <Button
            className="addButton"
            component={Link}
            to={`/sets/${setId}/flashcards/new`}
            variant="fab"
            color="secondary"
          >
            <AddIcon />
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(
    (state, props) => ({
      set: state.flashcards.sets[Number(props.match.params.setId) - 1]
    }),
    dispatch => ({
      deleteFlashcard: index => dispatch(deleteFlashcard(index)),
      updateSetTitle: (index, title) => dispatch(updateSetTitle(index, title))
    })
  )(Set)
);
