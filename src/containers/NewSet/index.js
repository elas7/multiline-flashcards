// @flow
import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";

import { createSet } from "../../modules/flashcards";
import Header from "../../components/Header";
import "./styles.css";

type Props = {
  createSet: Function
};

type State = {
  title: string,
  saved: boolean
};

class NewSet extends React.Component<Props, State> {
  state = {
    title: "",
    saved: false
  };

  isValid = () => {
    const { title, saved } = this.state;

    return title.trim() && !saved;
  };

  handleTitleChange = event => {
    const value = event.target.value;

    this.setState({
      title: value
    });
  };

  handleSave = (event) => {
    const { title } = this.state;

    event.preventDefault();

    if (!this.isValid()) {
      return;
    }

    this.props.createSet(title);
    this.setState({
      saved: true
    });
  };

  render() {
    const { title, saved } = this.state;

    if (saved) {
      return <Redirect push to="/" />;
    }

    return (
      <React.Fragment>
        <Header color="default">
          <IconButton component={Link} to="/" color="inherit">
            <ArrowBack />
          </IconButton>
          <Typography variant="subheading" color="inherit">
            New Set
          </Typography>
        </Header>
        <form className="newFlashcardContent" onSubmit={this.handleSave}>
          <div className="newFlashcardForm">
            <TextField
              label="Title"
              placeholder="Add the title..."
              onChange={event => this.handleTitleChange(event)}
              value={title}
              InputLabelProps={{
                shrink: true
              }}
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
        </form>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    createSet: text => dispatch(createSet(text))
  })
)(NewSet);
