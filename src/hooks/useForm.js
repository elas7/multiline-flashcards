import { useReducer } from "react";

/**
 * useForm hook
 *
 * Handles the state of a form. Returns the current form state,
 * and constructors to generate the props to pass into input elements.
 *
 * Exposes dispatch to programmatically update fields
 *
 * Optionally accepts an initial state and a validator function.
 */
export default function useForm(initialState, validator) {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "update":
        return {
          ...state,
          [action.payload.inputName]: action.payload.value
        };
      default:
        throw new Error();
    }
  }, initialState || {});

  const dispatchUpdate = (inputName, value) => {
    dispatch({
      type: "update",
      payload: { inputName, value }
    });
  };

  const inputPropsFactories = {
    getTextProps: inputName => ({
      value: state[inputName],
      onChange: event => {
        const value = event.target.value;
        dispatchUpdate(inputName, value);
      }
    })
  };

  const isValid = validator ? validator(state) : true;

  const getUpdater = inputName => value => {
    dispatchUpdate(inputName, value);
  };

  return { state, inputPropsFactories, isValid, getUpdater };
}
