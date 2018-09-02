// @flow
import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";

import { createFlashcard } from "../../modules/flashcards";
import Header from "../../components/Header";
import "./styles.css";

type Props = {
  createFlashcard: Function
};

type State = {
  title: string,
  text: string,
  saved: boolean,
  match: Object
};

class NewFlashcard extends React.Component<Props, State> {
  state = {
    title: "",
    text: "",
    saved: false
  };

  isValid = () => {
    const { title, text, saved } = this.state;

    return title.trim() && text.trim() && !saved;
  };

  handleChange = (fieldName, event) => {
    const value = event.target.value;

    this.setState({
      [fieldName]: value
    });
  };

  handleSave = () => {
    const {
      match: {
        params: { setId }
      }
    } = this.props;
    const { title, text } = this.state;

    if (!this.isValid()) {
      return;
    }

    this.props.createFlashcard({ title, text }, Number(setId - 1));
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

    if (saved) {
      return <Redirect push to={`/sets/${setId}`} />;
    }

    return (
      <React.Fragment>
        <Header color="default">
          <IconButton component={Link} to={`/sets/${setId}`} color="inherit">
            <ArrowBack />
          </IconButton>
          <Typography variant="subheading" color="inherit">
            New Flashcard
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
  null,
  dispatch => ({
    createFlashcard: (flashcard, index) =>
      dispatch(createFlashcard(flashcard, index))
  })
)(NewFlashcard);
