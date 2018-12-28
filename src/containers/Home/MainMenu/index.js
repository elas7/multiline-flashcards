// @flow
import * as React from "react";
import { connect } from "react-redux";
import yaml from "js-yaml";
import FileSaver from "file-saver";
import moment from "moment";

import { UploadField } from "@navjobs/upload";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { updateSets } from "../../../modules/flashcards";
import { Set } from "../../../types";

import styles from "./styles.module.css";

type Props = {
  sets: Set[],
  updateSets: Function
};

type State = {
  anchorEl: ?HTMLElement
};

class MainMenu extends React.Component<Props, State> {
  state = {
    anchorEl: null
  };

  static defaultProps = {
    sets: []
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleImport = files => {
    const { updateSets } = this.props;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const flashcards = yaml.safeLoad(reader.result);
      updateSets(flashcards.sets);
    };
    reader.readAsText(file);

    this.closeMenu();
  };

  handleExport = () => {
    const { sets } = this.props;

    const yamlString = yaml.safeDump({ sets });
    const blob = new Blob([yamlString], { type: "text/plain;charset=utf-8" });
    const fileName = `flashcards-${moment().format("Y-M-D")}.yaml`;
    FileSaver.saveAs(blob, fileName);

    this.closeMenu();
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <IconButton
          className={styles.menuIcon}
          color="inherit"
          onClick={this.handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorEl)}
          onClose={this.closeMenu}
        >
          <UploadField
            onFiles={this.handleImport}
            uploadProps={{
              accept: ".yaml"
            }}
          >
            {hover => (
              <MenuItem
                classes={{
                  root: hover ? "uploadFieldHover" : null
                }}
              >
                Import Data
              </MenuItem>
            )}
          </UploadField>
          <MenuItem onClick={this.handleExport}>Export Data</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    sets: state.flashcards.sets
  }),
  dispatch => ({
    updateSets: sets => dispatch(updateSets(sets))
  })
)(MainMenu);
