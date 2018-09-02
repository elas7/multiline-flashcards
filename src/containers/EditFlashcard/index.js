// @flow
import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";

import { updateFlashcard } from "../../modules/flashcards";
import { Flashcard } from "../../types";
import Header from "../../components/Header";
import "./styles.css";

type Props = {
  updateFlashcard: Function,
  match: Object,
  flashcard: ?Flashcard
};

type State = {
  title: string,
  text: string,
  saved: boolean
};

class EditFlashcard extends React.Component<Props, State> {
  state = {
    title: this.props.flashcard ? this.props.flashcard.title : "",
    text: this.props.flashcard ? this.props.flashcard.text : "",
    saved: false
  };

  isValid = () => {
    const { title, text, saved } = this.state;

    const hasChanged =
      this.props.flashcard.title !== title ||
      this.props.flashcard.text !== text;

    return title.trim() && text.trim() && !saved && hasChanged;
  };

  handleChange = (fieldName, event) => {
    const value = event.target.value;

    this.setState({
      [fieldName]: value
    });
  };

  handleSave = () => {
    const { match } = this.props;
    const { title, text } = this.state;

    if (!this.isValid()) {
      return;
    }

    const flashcardIndex = Number(match.params.flashcardId) - 1;
    const setIndex = Number(match.params.setId) - 1;
    this.props.updateFlashcard({ title, text }, flashcardIndex, setIndex);
    this.setState({
      saved: true
    });
  };

  render() {
    const {
      match: {
        params: { setId }
      }
    } = this.props;
    const { title, text, saved } = this.state;

    if (saved || !this.props.flashcard) {
      return <Redirect push to={`/sets/${setId}`} />;
    }

    return (
      <React.Fragment>
        <Header color="default">
          <IconButton component={Link} to={`/sets/${setId}`} color="inherit">
            <ArrowBack />
          </IconButton>
          <Typography variant="subheading" color="inherit">
            Edit Flashcard
          </Typography>
        </Header>
        <div className="newFlashcardContent">
          <div className="newFlashcardForm">
            <TextField
              label="Title"
              placeholder="Add the title..."
              onChange={event => this.handleChange("title", event)}
              value={title}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
            />
            <TextField
              label="Text"
              placeholder="Add the text..."
              onChange={event => this.handleChange("text", event)}
              value={text}
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
            variant="raised"
            color="primary"
            onClick={this.handleSave}
            disabled={!this.isValid()}
          >
            Save
          </Button>
        </div>
      </React.Fragment>
    );
  }
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
