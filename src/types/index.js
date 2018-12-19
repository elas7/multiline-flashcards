// @flow

export type Flashcard = {
  title: string,
  text: string
};

export type Set = {
  title: string,
  flashcards: Flashcard[]
};

export type DiffType = -1 | 0 | 1;

export type DiffText = [DiffType, string];
