// @flow
import * as React from "react";
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
import { getDiffText } from "../../utils";
import styles from "./styles.module.css";

type Props = {
  match: Object,
  flashcard: ?Flashcard
};

type State = {
  text: string,
  checked: boolean,
  correct: ?boolean,
  diffText: ?(DiffText[])
};

class PracticeFlashcard extends React.Component<Props, State> {
  state = {
    text: "",
    checked: false,
    correct: null,
    diffText: null
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.state.checked && prevState.checked) {
      this.focusTextInput();
    }
  }

  textInput = null;

  setTextInputRef = element => {
    this.textInput = element;
  };

  focusTextInput = () => {
    // Focus the text input using the raw DOM API
    if (this.textInput) this.textInput.focus();
  };

  handleChange = (fieldName, event) => {
    const value = event.target.value;

    this.setState({
      [fieldName]: value
    });
  };

  handleKeyDown = event => {
    const { checked } = this.state;

    // Submit if SHIFT + ENTER is pressed
    if (!checked && event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      this.handleCheck();
    }

    // Practice again if ENTER is pressed
    if (checked && event.key === "Enter") {
      event.preventDefault();
      this.handleAgain();
    }
  };

  handleCheck = () => {
    const { text, checked } = this.state;

    if (checked) {
      return;
    }

    const trimmedText = text.trim();

    const diffText = getDiffText(this.props.flashcard.text, trimmedText);
    const correct = diffText.length === 1 && diffText[0][0] === DIFF_EQUAL;

    this.setState({
      checked: true,
      text: trimmedText,
      correct,
      diffText
    });
  };

  handleAgain = () => {
    this.setState({
      text: "",
      checked: false,
      correct: null,
      diffText: null
    });
  };

  renderDiffText = (diffText: DiffText[], type: "additions" | "deletions") => {
    return diffText.map((diffText, index) => {
      const diffType = diffText[0];
      const value = diffText[1];
      const expectedType = type === "additions" ? DIFF_INSERT : DIFF_DELETE;
      const typeClass = type === "additions" ? styles.diffAddText : styles.diffDeleteText;

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

  render() {
    const {
      match: {
        params: { setId }
      }
    } = this.props;
    const { text, checked, correct, diffText } = this.state;

    if (!this.props.flashcard) {
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
              {this.props.flashcard.title}
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
                  {this.renderDiffText(diffText, "additions")}
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
                  {this.renderDiffText(diffText, "deletions")}
                </Typography>
              </React.Fragment>
            ) : (
              <TextField
                placeholder="Type the text here"
                onChange={event => this.handleChange("text", event)}
                inputRef={this.setTextInputRef}
                disabled={checked}
                value={text}
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
            <Button variant="raised" color="primary" onClick={this.handleAgain}>
              Practice Again
            </Button>
          ) : (
            <Button
              variant="raised"
              color="primary"
              onClick={this.handleCheck}
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
}

export default connect((state, props) => ({
  flashcard:
    state.flashcards.sets[Number(props.match.params.setId) - 1].flashcards[
      Number(props.match.params.flashcardId) - 1
    ]
}))(PracticeFlashcard);
