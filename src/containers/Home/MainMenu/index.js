// @flow
import React, { useState } from "react";
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

function MainMenu({ updateSets, sets = [] }: Props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleImport = files => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const flashcards = yaml.safeLoad(reader.result);
      updateSets(flashcards.sets);
    };
    reader.readAsText(file);

    closeMenu();
  };

  const handleExport = () => {
    const yamlString = yaml.safeDump({ sets });
    const blob = new Blob([yamlString], { type: "text/plain;charset=utf-8" });
    const fileName = `flashcards-${moment().format("Y-M-D")}.yaml`;
    FileSaver.saveAs(blob, fileName);

    closeMenu();
  };

  return (
    <React.Fragment>
      <IconButton
        className={styles.menuIcon}
        color="inherit"
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <UploadField
          onFiles={handleImport}
          uploadProps={{
            accept: ".yaml"
          }}
        >
          {hover => (
            <MenuItem
              classes={{
                root: hover ? styles.uploadFieldHover : null
              }}
            >
              Import Data
            </MenuItem>
          )}
        </UploadField>
        <MenuItem onClick={handleExport}>Export Data</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default connect(
  state => ({
    sets: state.flashcards.sets
  }),
  dispatch => ({
    updateSets: sets => dispatch(updateSets(sets))
  })
)(MainMenu);
