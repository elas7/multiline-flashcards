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

class DeleteSetModal extends React.Component<Props, State> {
  handleDeleteConfirm = () => {
    const { id, setId } = this.props;

    this.props.deleteFlashcard(id, Number(setId) - 1);
    this.props.onDeleteSuccess();
  };

  render() {
    const { id, setId, flashcard, onClose } = this.props;

    console.log(id, setId, flashcard)

    return (
      <DeleteModal
        type="flashcard"
        title={flashcard ? flashcard.title : null}
        open={id !== null}
        onClose={onClose}
        onDeleteConfirm={this.handleDeleteConfirm}
      />
    );
  }
}

export default connect(
  (state, props) => ({
    flashcard: props.id !== null
      ? state.flashcards.sets[Number(props.setId) - 1].flashcards[props.id]
      : null
  }),
  dispatch => ({
    deleteFlashcard: (index, setIndex) =>
      dispatch(deleteFlashcard(index, setIndex))
  })
)(DeleteSetModal);
