## Multiline Flashcards

"Multiline Flashcards" is a simple flashcards app that helps you memorize stuff by typing.

This is very similar to apps like Quizlet, Anki, Tinycards & Cram. The main difference
is that it supports multi-line cards, both in mobile and desktop. (As far as I know there's
an extension for that in Anki, but it doesn't work on mobile).

Other characteristics:
- Flashcards are text only. No images or audio.
- You must type the answer. There is no view-only mode or multiple-choice mode.
- Favours repeated study of the same flashcard. There is no automatic rotation.
- Progressive Web App. Works offline.
- No users or persistence. But you can export and import your flashcards as a YAML file, and the browsers
  stores them in localStorage.

Technical stuff:
- Made with React, Redux & create-react-app
- Uses [ducks](https://github.com/erikras/ducks-modular-redux) for organizing Redux code.

Project structure:
- React components can be in the "components" or "containers" folder.
  - "components" has reusable components.
  - "containers" has components that represent individual pages, and non-reusable components used in them. Most of the time they are connected to Redux.
