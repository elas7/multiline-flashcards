// @flow
import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import { Flashcard, WordInString } from "../../types";
import Header from "../../components/Header";
import BackButton from "../../components/BackButton";
import { areStringsEqual, findFirstDifferentWord } from "../../utils";
import "./styles.css";

type Props = {
  match: Object,
  flashcard: ?Flashcard
};

type State = {
  text: string,
  checked: boolean,
  correct: ?boolean,
  firstDifferentWord: ?WordInString
};

class PracticeFlashcard extends React.Component<Props, State> {
  state = {
    text: "",
    checked: false,
    correct: null,
    firstDifferentWord: null
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

    const correct = areStringsEqual(trimmedText, this.props.flashcard.text);
    const firstDifferentWord = !correct
      ? findFirstDifferentWord(trimmedText, this.props.flashcard.text)
      : null;

    this.setState({
      checked: true,
      text: trimmedText,
      correct,
      firstDifferentWord
    });
  };

  handleAgain = () => {
    this.setState({
      text: "",
      checked: false,
      correct: null,
      firstDifferentWord: null
    });
  };

  render() {
    const {
      match: {
        params: { setId }
      }
    } = this.props;
    const { text, checked, correct, firstDifferentWord } = this.state;

    if (!this.props.flashcard) {
      return <Redirect to="/" />;
    }

    console.log("checked", checked);

    return (
      <React.Fragment>
        <Header color="default">
          <BackButton parentURL={`/sets/${setId}`} />
          <Typography variant="subheading" color="inherit">
            Practice
          </Typography>
        </Header>
        <div className="practiceContent">
          <div className="practiceForm">
            <Typography variant="title" color="inherit">
              {this.props.flashcard.title}
            </Typography>
            {checked && !correct ? (
              <React.Fragment>
                {text && (
                  <>
                    <Typography
                      variant="subheading"
                      color="textSecondary"
                      className="practiceTextSectionTitle"
                    >
                      Your answer
                    </Typography>
                    <Typography
                      variant="subheading"
                      color="default"
                      className="practiceTextCorrection"
                      gutterBottom
                    >
                      {text.slice(0, firstDifferentWord.left)}
                      <span className="errorText">
                        {firstDifferentWord.word}
                      </span>
                      {text.slice(firstDifferentWord.right)}
                    </Typography>
                  </>
                )}
                <Typography
                  variant="subheading"
                  color="textSecondary"
                  className="practiceTextSectionTitle"
                >
                  Correct answer
                </Typography>
                <Typography
                  variant="subheading"
                  color="inherit"
                  className="practiceTextCorrection"
                >
                  {this.props.flashcard.text}
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
            className="practiceNotification"
            ContentProps={{
              className: correct
                ? "practiceNotificationCorrect"
                : "practiceNotificationIncorrect"
            }}
            transitionDuration={{ exit: 0 }}
            message={
              <span>
                {correct ? "You are correct!" : "Oops, that's not correct"}
                <br />
                {firstDifferentWord && firstDifferentWord.word}
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
