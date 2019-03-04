// @flow
import React, { useEffect, useReducer, useRef } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from "diff-match-patch";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import { Flashcard, DiffText } from "../../types";
import Header from "../../components/Header";
import BackButton from "../../components/BackButton";
import useForm from "../../hooks/useForm";
import usePrevious from "../../hooks/usePrevious";
import useKey from "../../hooks/useKey";
import { getDiffText } from "../../utils";
import styles from "./styles.module.css";

type Props = {
  match: Object,
  flashcard: ?Flashcard
};

const useInputFocus = (checked, prevChecked) => {
  const textInput = useRef(null);

  const focusTextInput = () => {
    // Focus the text input using the raw DOM API
    if (textInput.current) textInput.current.focus();
  };

  useEffect(() => {
    if (!checked && prevChecked) {
      focusTextInput();
    }
  }, [checked, prevChecked]);

  return element => {
    textInput.current = element;
  };
};

const renderDiffText = (
  diffText: DiffText[],
  type: "additions" | "deletions"
) => {
  return diffText.map((diffText, index) => {
    const diffType = diffText[0];
    const value = diffText[1];
    const expectedType = type === "additions" ? DIFF_INSERT : DIFF_DELETE;
    const typeClass =
      type === "additions" ? styles.diffAddText : styles.diffDeleteText;

    if (diffType === DIFF_EQUAL) {
      return value;
    }

    if (diffType === expectedType) {
      return (
        <span key={index} className={typeClass}>
          {value}
        </span>
      );
    }
  });
};

function PracticeFlashcard({
  match: {
    params: { setId }
  },
  flashcard
}: Props) {
  const {
    state: { text },
    inputPropsFactories: { getTextProps },
    getUpdater
  } = useForm({ text: "" });
  const setText = getUpdater("text");

  const [{ checked, correct, diffText }, setState] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      checked: false,
      correct: null,
      diffText: null
    }
  );
  const prevChecked = usePrevious(checked);

  const handleCheck = () => {
    if (checked) {
      return;
    }

    const trimmedText = text.trim();
    const diffText = getDiffText(flashcard.text, trimmedText);
    const correct = diffText.length === 1 && diffText[0][0] === DIFF_EQUAL;

    setText(trimmedText);
    setState({ checked: true, correct, diffText });
  };

  const handleAgain = () => {
    setText("");
    setState({ checked: false, correct: null, diffText: null });
  };

  // Submit if SHIFT + ENTER is pressed
  useKey([["Shift", "Enter"]], event => {
    if (!checked) {
      event.preventDefault();
      handleCheck();
    }
  });

  // Practice again if ENTER is pressed
  useKey(["Enter"], event => {
    if (checked) {
      event.preventDefault();
      handleAgain();
    }
  });

  const setInputRef = useInputFocus(checked, prevChecked);

  if (!flashcard) {
    return <Redirect to="/" />;
  }

  return (
    <React.Fragment>
      <Header color="default">
        <BackButton parentURL={`/sets/${setId}`} />
        <Typography variant="subheading" color="inherit">
          Practice
        </Typography>
      </Header>
      <div className={styles.practiceContent}>
        <div className={styles.practiceForm}>
          <Typography variant="title" color="inherit">
            {flashcard.title}
          </Typography>
          {checked && !correct ? (
            <React.Fragment>
              <Typography
                variant="subheading"
                color="textSecondary"
                className={styles.practiceTextSectionTitle}
              >
                Correct answer
              </Typography>
              <Typography
                variant="subheading"
                color="inherit"
                className={styles.practiceTextCorrection}
              >
                {renderDiffText(diffText, "additions")}
              </Typography>

              <Typography
                variant="subheading"
                color="textSecondary"
                className={styles.practiceTextSectionTitle}
              >
                Your answer
              </Typography>
              <Typography
                variant="subheading"
                color="default"
                className={styles.practiceTextCorrection}
                gutterBottom
              >
                {renderDiffText(diffText, "deletions")}
              </Typography>
            </React.Fragment>
          ) : (
            <TextField
              placeholder="Type the text here"
              inputRef={setInputRef}
              disabled={checked}
              {...getTextProps("text")}
              spellCheck="false"
              rows={3}
              rowsMax={10}
              autoFocus
              InputLabelProps={{
                shrink: true
              }}
              multiline
              margin="normal"
            />
          )}
        </div>
        {checked ? (
          <Button variant="contained" color="primary" onClick={handleAgain}>
            Practice Again
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheck}
            disabled={checked}
          >
            Check
          </Button>
        )}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          open={checked}
          className={styles.practiceNotification}
          ContentProps={{
            className: correct
              ? styles.practiceNotificationCorrect
              : styles.practiceNotificationIncorrect
          }}
          transitionDuration={{ exit: 0 }}
          message={
            <span>
              {correct ? "You are correct!" : "Oops, that's not correct"}
            </span>
          }
        />
      </div>
    </React.Fragment>
  );
}

export default connect((state, props) => ({
  flashcard:
    state.flashcards.sets[Number(props.match.params.setId) - 1].flashcards[
      Number(props.match.params.flashcardId) - 1
    ]
}))(PracticeFlashcard);
