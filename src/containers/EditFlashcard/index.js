// @flow
import React, { useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import BackButton from "../../components/BackButton";
import GoBack from "../../components/GoBack";
import useFlashcardForm from "../../hooks/useFlashcardForm";
import { updateFlashcard } from "../../modules/flashcards";
import { Flashcard } from "../../types";
import Header from "../../components/Header";
import styles from "./styles.module.css";

type Props = {
  updateFlashcard: Function,
  match: Object,
  flashcard: ?Flashcard
};

function EditFlashcard({
  updateFlashcard,
  flashcard,
  match: {
    params: { setId, flashcardId }
  }
}: Props) {
  const {
    titleProps,
    textProps,
    saved,
    handleSave,
    isValid
  } = useFlashcardForm({
    initialTitle: flashcard ? flashcard.title : "",
    initialText: flashcard ? flashcard.text : "",
    persistFunction: updateFlashcard,
    setId,
    flashcardId
  });

  if (saved || !flashcard) {
    return <GoBack parentURL={`/sets/${setId}`} />;
  }

  return (
    <React.Fragment>
      <Header color="default">
        <BackButton parentURL={`/sets/${setId}`} />
        <Typography variant="subheading" color="inherit">
          Edit Flashcard
        </Typography>
      </Header>
      <div className={styles.newFlashcardContent}>
        <div className={styles.newFlashcardForm}>
          <TextField
            label="Title"
            placeholder="Add the title..."
            {...titleProps}
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
          />
          <TextField
            label="Text"
            placeholder="Add the text..."
            {...textProps}
            rows={3}
            rowsMax={10}
            InputLabelProps={{
              shrink: true
            }}
            multiline
            margin="normal"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!isValid}
        >
          Save
        </Button>
      </div>
    </React.Fragment>
  );
}

export default connect(
  (state, props) => ({
    flashcard:
      state.flashcards.sets[Number(props.match.params.setId) - 1].flashcards[
        Number(props.match.params.flashcardId) - 1
      ]
  }),
  dispatch => ({
    updateFlashcard: (flashcard, flashcardIndex, setIndex) =>
      dispatch(updateFlashcard(flashcard, flashcardIndex, setIndex))
  })
)(EditFlashcard);
