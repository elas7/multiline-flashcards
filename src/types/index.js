// @flow

export type Flashcard = {
  title: string,
  text: string,
}

export type Set = {
  title: string,
  flashcards: Flashcard[]
}

/**
 * Represent a word within a string
 */
export type WordInString = {
  // the word text
  text: string,

  // left index within the string
  left: number,

  // right index within the string
  right: number,
}