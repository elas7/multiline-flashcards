// @flow
import React from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import BackButton from "../../components/BackButton";
import GoBack from "../../components/GoBack";
import Header from "../../components/Header";
import { createFlashcard } from "../../modules/flashcards";
import useFlashcardForm from "../../hooks/useFlashcardForm";
import styles from "./styles.module.css";

type Props = {
  createFlashcard: Function,
  history: Object,
  match: Object,
  lastLocation: Object | null
};

function NewFlashcard({
  createFlashcard,
  history,
  lastLocation,
  match: {
    params: { setId }
  }
}: Props) {
  const {
    titleProps,
    textProps,
    saved,
    handleSave,
    isValid
  } = useFlashcardForm({
    initialTitle: "",
    initialText: "",
    persistFunction: createFlashcard,
    setId: setId
  });

  if (saved) {
    return <GoBack parentURL={`/sets/${setId}`} />;
  }

  return (
    <React.Fragment>
      <Header color="default">
        <BackButton parentURL={`/sets/${setId}`} />
        <Typography variant="subheading" color="inherit">
          New Flashcard
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
  null,
  dispatch => ({
    createFlashcard: (flashcard, index) =>
      dispatch(createFlashcard(flashcard, index))
  })
)(NewFlashcard);
