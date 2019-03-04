// @flow
import React, { useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import BackButton from "../../components/BackButton";
import GoBack from "../../components/GoBack";
import Header from "../../components/Header";
import useForm from "../../hooks/useForm";
import { createSet } from "../../modules/flashcards";
import styles from "./styles.module.css";

type Props = {
  createSet: Function
};

function NewSet({ createSet }: Props) {
  const [saved, setSaved] = useState(false);

  const validator = ({ title }) => {
    return title.trim() && !saved;
  };

  const {
    state: { title },
    inputPropsFactories: { getTextProps },
    isValid
  } = useForm({ title: "" }, validator);

  const handleSave = event => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    createSet(title);
    setSaved(true);
  };

  if (saved) {
    return <GoBack parentURL="/" />;
  }

  return (
    <React.Fragment>
      <Header color="default">
        <BackButton />
        <Typography variant="subheading" color="inherit">
          New Set
        </Typography>
      </Header>
      <form className={styles.newFlashcardContent} onSubmit={handleSave}>
        <div className={styles.newFlashcardForm}>
          <TextField
            label="Title"
            placeholder="Add the title..."
            {...getTextProps("title")}
            InputLabelProps={{
              shrink: true
            }}
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
      </form>
    </React.Fragment>
  );
}

export default connect(
  null,
  dispatch => ({
    createSet: text => dispatch(createSet(text))
  })
)(NewSet);
