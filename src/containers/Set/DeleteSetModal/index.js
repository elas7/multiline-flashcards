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

class DeleteSetModal extends React.Component<Props, State> {
  handleDeleteConfirm = () => {
    const { id } = this.props;

    this.props.deleteSet(Number(id) - 1);
    this.props.onDeleteSuccess();
  };

  render() {
    const { id, set, onClose } = this.props;

    return (
      <DeleteModal
        type="set"
        title={set ? set.title : null}
        open={id !== null}
        onClose={onClose}
        onDeleteConfirm={this.handleDeleteConfirm}
      />
    );
  }
}

export default connect(
  (state, props) => ({
    set: props.id ? state.flashcards.sets[Number(props.id) - 1] : null
  }),
  dispatch => ({
    deleteSet: index => dispatch(deleteSet(index))
  })
)(DeleteSetModal);
