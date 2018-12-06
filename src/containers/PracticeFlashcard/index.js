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

  isValid = () => {
    const { text, checked } = this.state;

    return text.trim() && !checked;
  };

  handleChange = (fieldName, event) => {
    const value = event.target.value;

    this.setState({
      [fieldName]: value
    });
  };

  handleCheck = () => {
    const { text } = this.state;

    if (!this.isValid()) {
      return;
    }

    const correct = areStringsEqual(text, this.props.flashcard.text);
    const firstDifferentWord = !correct
      ? findFirstDifferentWord(text.trim(), this.props.flashcard.text)
      : null;

    this.setState({
      checked: true,
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
      return <Redirect push to="/" />;
    }

    return (
      <React.Fragment>
        <Header color="default">
          <BackButton />
          <Typography variant="subheading" color="inherit">
            Practice
          </Typography>
        </Header>
        <div className="practiceContent">
          <div className="practiceForm">
            <Typography variant="title" color="inherit">
              {this.props.flashcard.title}
            </Typography>
            {checked && firstDifferentWord ? (
              <Typography
                variant="subheading"
                color="default"
                className="practiceTextCorrection"
              >
                {text.slice(0, firstDifferentWord.left)}
                <span className="errorText">{firstDifferentWord.word}</span>
                {text.slice(firstDifferentWord.right)}
              </Typography>
            ) : (
              <TextField
                placeholder="Type the text here"
                onChange={event => this.handleChange("text", event)}
                disabled={checked}
                value={text}
                spellCheck="false"
                rows={3}
                rowsMax={10}
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
              disabled={!this.isValid()}
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
