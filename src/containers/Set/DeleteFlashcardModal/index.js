// @flow
import * as React from "react";
import { connect } from "react-redux";
import { deleteFlashcard } from "../../../modules/flashcards";
import DeleteModal from "../../../components/DeleteModal";
import type { Flashcard } from "../../../types";

type Props = {
  id: number,
  setId: number,
  onClose: Function,
  onDeleteSuccess: Function,
  flashcard: Flashcard,
  deleteFlashcard: Function
};

function DeleteSetModal({
  id,
  setId,
  onClose,
  onDeleteSuccess,
  flashcard,
  deleteFlashcard
}: Props) {
  const handleDeleteConfirm = () => {
    deleteFlashcard(id, Number(setId) - 1);
    onDeleteSuccess();
  };

  return (
    <DeleteModal
      type="flashcard"
      title={flashcard ? flashcard.title : null}
      open={id !== null}
      onClose={onClose}
      onDeleteConfirm={handleDeleteConfirm}
    />
  );
}

export default connect(
  (state, props) => ({
    flashcard:
      props.id !== null
        ? state.flashcards.sets[Number(props.setId) - 1].flashcards[props.id]
        : null
  }),
  dispatch => ({
    deleteFlashcard: (index, setIndex) =>
      dispatch(deleteFlashcard(index, setIndex))
  })
)(DeleteSetModal);
