// @flow
import * as React from "react";
import { connect } from "react-redux";
import { deleteSet } from "../../../modules/flashcards";
import DeleteModal from "../../../components/DeleteModal";
import { Set } from "../../../types";

type Props = {
  id: number,
  onClose: Function,
  onDeleteSuccess: Function,
  set: Set,
  deleteSet: Function
};

function DeleteSetModal({
  id,
  onClose,
  onDeleteSuccess,
  set,
  deleteSet
}: Props) {
  const handleDeleteConfirm = () => {
    deleteSet(Number(id) - 1);
    onDeleteSuccess();
  };

  return (
    <DeleteModal
      type="set"
      title={set ? set.title : null}
      open={id !== null}
      onClose={onClose}
      onDeleteConfirm={handleDeleteConfirm}
    />
  );
}

export default connect(
  (state, props) => ({
    set: props.id ? state.flashcards.sets[Number(props.id) - 1] : null
  }),
  dispatch => ({
    deleteSet: index => dispatch(deleteSet(index))
  })
)(DeleteSetModal);
