// @flow
import type { Set, Flashcard } from "../types";

const CREATE_SET = "flashcards/CREATE_SET";
const DELETE_SET = "flashcards/DELETE_SET";
const UPDATE_SET_TITLE = "flashcards/UPDATE_SET_TITLE";
const UPDATE_SETS = "flashcards/UPDATE_SETS";

const CREATE_FLASHCARD = "flashcards/CREATE_FLASHCARD";
const DELETE_FLASHCARD = "flashcards/DELETE_FLASHCARD";
const UPDATE_FLASHCARD = "flashcards/UPDATE_FLASHCARD";
const MOVE_FLASHCARD = "flashcards/MOVE_FLASHCARD";

type State = {
  sets: Set[]
};

const initialState: State = {
  sets: []
};

/**
 * Reducer
 */
export default function reducer(state: State = initialState, action: Object) {
  switch (action.type) {
    case CREATE_SET: {
      const newSet = { title: action.payload.title, flashcards: [] };

      return {
        ...state,
        sets: [...state.sets, newSet]
      };
    }
    case DELETE_SET:
      return {
        ...state,
        sets: state.sets.filter((set, index) => index !== action.payload.index)
      };
    case UPDATE_SET_TITLE:
      return {
        ...state,
        sets: state.sets.map((set, index) => {
          if (index === action.payload.index) {
            return { ...set, title: action.payload.title };
          }

          return set;
        })
      };
    case UPDATE_SETS:
      return { ...state, sets: action.payload.sets };
    case CREATE_FLASHCARD:
      return {
        ...state,
        sets: state.sets.map((set, index) => {
          if (index === action.payload.setIndex) {
            return {
              ...set,
              flashcards: [...set.flashcards, action.payload.flashcard]
            };
          }

          return set;
        })
      };
    case DELETE_FLASHCARD:
      return {
        ...state,
        sets: state.sets.map((set, index) => {
          if (index === action.payload.setIndex) {
            return {
              ...set,
              flashcards: set.flashcards.filter(
                (flashcard, index) => index !== action.payload.flashcardIndex
              )
            };
          }

          return set;
        })
      };
    case UPDATE_FLASHCARD:
      return {
        ...state,

        sets: state.sets.map((set, index) => {
          if (index === action.payload.setIndex) {
            return {
              ...set,
              flashcards: set.flashcards.map((flashcard, index) => {
                if (index === action.payload.flashcardIndex) {
                  return action.payload.flashcard;
                }

                return flashcard;
              })
            };
          }

          return set;
        })
      };
    case MOVE_FLASHCARD:
      return {
        ...state,

        sets: state.sets.map((set, index) => {
          if (index === action.payload.setIndex) {
            const flaschardToMove = set.flashcards[action.payload.flashcardIndex];
            const newFlashcards = [...set.flashcards];

            newFlashcards.splice(action.payload.flashcardIndex, 1);
            newFlashcards.splice(action.payload.destinationIndex, 0, flaschardToMove);

            return {
              ...set,
              flashcards: newFlashcards
            };
          }

          return set;
        })
      };
    default:
      return state;
  }
}

export function createSet(title: string) {
  return {
    type: CREATE_SET,
    payload: {
      title
    }
  };
}

export function deleteSet(index: number) {
  return {
    type: DELETE_SET,
    payload: {
      index
    }
  };
}

export function updateSetTitle(index: number, title: string) {
  return {
    type: UPDATE_SET_TITLE,
    payload: {
      index,
      title
    }
  };
}

export function createFlashcard(flashcard: Flashcard, setIndex: number) {
  return {
    type: CREATE_FLASHCARD,
    payload: {
      flashcard,
      setIndex
    }
  };
}

export function deleteFlashcard(flashcardIndex: number, setIndex: number) {
  return {
    type: DELETE_FLASHCARD,
    payload: {
      flashcardIndex,
      setIndex
    }
  };
}

export function moveFlashcard(
  flashcardIndex: number,
  destinationIndex: number,
  setIndex: number
) {
  return {
    type: MOVE_FLASHCARD,
    payload: {
      flashcardIndex,
      destinationIndex,
      setIndex
    }
  };
}

export function updateFlashcard(
  flashcard: Flashcard,
  flashcardIndex: number,
  setIndex: number
) {
  return {
    type: UPDATE_FLASHCARD,
    payload: {
      flashcard,
      flashcardIndex,
      setIndex
    }
  };
}

export function updateSets(sets: Set[]) {
  return {
    type: UPDATE_SETS,
    payload: {
      sets
    }
  };
}
