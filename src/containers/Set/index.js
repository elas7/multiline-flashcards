// @flow
import React, { useState } from "react";
import cx from "classnames";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RootRef from "@material-ui/core/RootRef";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { Dice5 } from "mdi-material-ui";

import BackButton from "../../components/BackButton";
import useKey from "../../hooks/useKey";
import { moveFlashcard, updateSetTitle } from "../../modules/flashcards";
import Header from "../../components/Header";
import EmptyMessage from "../../components/EmptyMessage";
import { maybePluralize, getRandomIntInclusive } from "../../utils";
import DeleteSetModal from "./DeleteSetModal";
import DeleteFlashcardModal from "./DeleteFlashcardModal";
import styles from "./styles.module.css";

type Props = {
  moveFlashcard: Function,
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
  // Used to prevent race between input blur and button click
  editTitleMouseDown: boolean,
  // title being edited
  title: string
};

function Set({
  set,
  moveFlashcard,
  updateSetTitle,
  deleteSet,
  history,
  match: {
    params: { setId }
  }
}: Props) {
  if (!set) {
    return <Redirect push to="/" />;
  }

  const { title: oldTitle, flashcards } = set;

  // Id of Flashcard to show in Delete modal, if any
  const [deleteModalFlashcardId, setDeleteModalFlashcardId] = useState(null);
  // Id of Set to show in Delete modal, if any
  const [deleteModalSetId, setDeleteModalSetId] = useState(null);
  // true if the title set is being edited
  const [editingTitle, setEditingTitle] = useState(false);
  // Used to prevent race between input blur and button click
  const [editTitleMouseDown, setEditTitleMouseDown] = useState(false);
  // title being edited
  const [title, setTitle] = useState(oldTitle);

  // "Click" random when "r" is pressed
  useKey(
    ["r"],
    () => {
      if (!editingTitle) {
        handleRandomClick();
      }
    },
    "keyup"
  );

  const handleDeleteSetClick = () => {
    setDeleteModalSetId(setId);
  };

  const handleDeleteButtonClick = flashcardIndex => {
    setDeleteModalFlashcardId(flashcardIndex);
  };

  const handleDeleteSetModalClose = () => {
    setDeleteModalSetId(null);
  };

  const handleDeleteFlashcardModalClose = () => {
    setDeleteModalFlashcardId(null);
  };

  const handleSetDeleteSuccess = () => {
    history.push(`/`);
  };

  const handleFlashcardDeleteSuccess = () => {
    setDeleteModalFlashcardId(null);
  };

  const handleFlashcardClick = index => {
    history.push(`/sets/${setId}/flashcards/${index + 1}/practice`);
  };

  const handleEditTitleClick = () => {
    if (!editingTitle) {
      setEditingTitle(true);
    } else {
      maybeSaveTitle();
    }
  };

  const handleEditTitleMouseDown = () => {
    setEditTitleMouseDown(true);

    setTimeout(() => {
      setEditTitleMouseDown(false);
    }, 100);
  };

  const handleTitleChange = event => {
    const value = event.target.value;

    setTitle(value);
  };

  const handleRandomClick = () => {
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

  const handleTitleBlur = () => {
    // Sometimes blur and edit-click can happen at the same time.
    // If so, let edit-click handle the save
    if (!editTitleMouseDown) {
      maybeSaveTitle();
    }
  };

  const handleTitleSubmit = event => {
    event.preventDefault();
    maybeSaveTitle();
  };

  const maybeSaveTitle = () => {
    if (title !== oldTitle && title.trim()) {
      updateSetTitle(Number(setId) - 1, title);
    }

    setTitle(title);
    setEditingTitle(false);
  };

  const onDragEnd = result => {
    const { destination, source } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    // dropped to the same place
    if (destination.index === source.index) {
      return;
    }

    moveFlashcard(source.index, destination.index, Number(setId) - 1);
  };

  const hasFlashcards = flashcards.length !== 0;
  const hasMoreThanOneFlashcard = flashcards.length > 1;

  return (
    <React.Fragment>
      <DeleteSetModal
        id={deleteModalSetId}
        onClose={handleDeleteSetModalClose}
        onDeleteSuccess={handleSetDeleteSuccess}
      />
      <DeleteFlashcardModal
        id={deleteModalFlashcardId}
        setId={setId}
        onClose={handleDeleteFlashcardModalClose}
        onDeleteSuccess={handleFlashcardDeleteSuccess}
      />
      <Header>
        <BackButton className={styles.menuIconLeft} />
        <Typography
          variant="headline"
          color="inherit"
          className={styles.appBarTitle}
        >
          Set
        </Typography>
        <IconButton
          className={styles.menuIcon}
          color="inherit"
          onClick={handleDeleteSetClick}
        >
          <DeleteIcon />
        </IconButton>
      </Header>
      <div className={styles.setInfo}>
        <div className={styles.titleContainer}>
          {editingTitle ? (
            <form className={styles.titleForm} onSubmit={handleTitleSubmit}>
              <TextField
                autoFocus
                label="Title"
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
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
            onClick={handleEditTitleClick}
            onMouseDown={handleEditTitleMouseDown}
            classes={{ root: styles.editTitleButton }}
          >
            <EditIcon />
          </IconButton>
        </div>
        <Typography variant="subheading" color="textSecondary">
          {maybePluralize(flashcards.length, "flashcard")}
        </Typography>
        {hasFlashcards && (
          <div className={styles.setButtonContainer}>
            <Button
              disabled={!hasMoreThanOneFlashcard}
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleRandomClick}
            >
              Random
              <Dice5 className={styles.iconRight} />
            </Button>
          </div>
        )}
      </div>
      <Divider />
      <div className={styles.textsContainer} id="scrollingElement">
        {hasFlashcards ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                  <List
                    disablePadding
                    className={cx({
                      [styles.isDragging]: snapshot.isDraggingOver,
                      [styles.isDragDisabled]: !hasMoreThanOneFlashcard
                    })}
                  >
                    {flashcards.map(({ title }, index) => {
                      return (
                        <Draggable
                          key={index}
                          draggableId={String(index)}
                          index={index}
                          isDragDisabled={!hasMoreThanOneFlashcard}
                        >
                          {(provided, snapshot) => (
                            <RootRef rootRef={provided.innerRef}>
                              <ListItem
                                {...provided.draggableProps}
                                classes={{
                                  default: cx(styles.listItem, {
                                    [styles.isDragging]: snapshot.isDragging
                                  })
                                }}
                                button
                                disableTouchRipple
                                disableRipple={true}
                                key={index}
                                onClick={() => handleFlashcardClick(index)}
                              >
                                <div
                                  className={cx(styles.dragHandle, {
                                    [styles.isDragging]: snapshot.isDragging
                                  })}
                                  {...provided.dragHandleProps}
                                >
                                  <DragIndicatorIcon />
                                </div>
                                <ListItemText primary={title} />
                                <IconButton
                                  onClick={event => {
                                    event.stopPropagation();
                                  }}
                                  component={Link}
                                  to={`/sets/${setId}/flashcards/${index +
                                    1}/edit`}
                                >
                                  <EditIcon />
                                </IconButton>

                                <IconButton
                                  onClick={event => {
                                    event.stopPropagation();
                                    handleDeleteButtonClick(index);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItem>
                            </RootRef>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </List>
                </RootRef>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <EmptyMessage />
        )}
        <Fab
          className={styles.addButton}
          component={Link}
          to={`/sets/${setId}/flashcards/new`}
          color="secondary"
        >
          <AddIcon />
        </Fab>
      </div>
    </React.Fragment>
  );
}

export default withRouter(
  connect(
    (state, props) => ({
      set: state.flashcards.sets[Number(props.match.params.setId) - 1]
    }),
    dispatch => ({
      moveFlashcard: (index, destinationIndex, setIndex) =>
        dispatch(moveFlashcard(index, destinationIndex, setIndex)),
      updateSetTitle: (index, title) => dispatch(updateSetTitle(index, title))
    })
  )(Set)
);
