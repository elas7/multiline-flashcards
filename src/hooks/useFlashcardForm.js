import { useState } from "react";
import useForm from "./useForm";

/**
 * useFlashcardForm hook
 *
 * Handles the state of a the "new flashcard" and "edit flashcard" forms,
 * and persists the results when the forms are saved.
 */
export default function useFlashcardForm({
  initialTitle,
  initialText,
  persistFunction,
  setId,
  flashcardId
}) {
  // if we know the "flashcardId", we are editing the form
  const type = flashcardId ? "edit" : "new";

  const [saved, setSaved] = useState(false);

  const validator = ({ title, text }) => {
    const fieldsNotEmpty = title.trim() && text.trim();

    if (type === "new") {
      return fieldsNotEmpty && !saved;
    }

    const hasChanged = initialTitle !== title || initialText !== text;
    return fieldsNotEmpty && !saved && hasChanged;
  };

  const {
    state: { title, text },
    inputPropsFactories: { getTextProps },
    isValid
  } = useForm(
    {
      title: initialTitle,
      text: initialText
    },
    validator
  );

  const handleSave = () => {
    if (!isValid) {
      return;
    }

    const setIndex = Number(setId) - 1;
    if (type === "new") {
      persistFunction({ title, text }, setIndex);
    } else {
      const flashcardIndex = Number(flashcardId) - 1;
      persistFunction({ title, text }, flashcardIndex, setIndex);
    }

    setSaved(true);
  };

  return {
    titleProps: getTextProps("title"),
    textProps: getTextProps("text"),
    saved,
    handleSave,
    isValid
  };
}
