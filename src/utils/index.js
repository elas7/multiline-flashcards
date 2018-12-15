// @flow
import type { WordInString } from "../types";

/**
 * Find the word located in the string with a numeric index.
 * Also, return the left and right index of the word.
 */
const getClosestWord = (string: string, index: number): WordInString => {
  // Search for the word's beginning and end.
  // If the index is a white space, the word matched is the last one.
  const left = string.slice(0, index + 1).search(/\S+\s?$/);
  let right = string.slice(index).search(/\s/);

  // handle no whitespace after the word (final word)
  if (right === -1) {
    right = string.length - index;
  }

  // Get the word, using the located bounds to extract it from the string.
  const word = string.slice(left, right + index);
  return { word, left, right: right + index };
};

const normalizeString = (string: string) => {
  return string.toLowerCase().trim();
};

/**
 * Find the index of the of the first difference in two string.
 */
const findFirstDifferentIndex = (a: string, b: string) => {
  if (a.length < b.length) [a, b] = [b, a];
  return [...a].findIndex((chr, i) => chr !== b[i]);
};

/**
 * Find the first different word in two string.
 */
export const findFirstDifferentWord = (a: string, b: string) => {
  const normalizedA = normalizeString(a);
  const normalizedB = normalizeString(b);

  const closestWord = getClosestWord(
    normalizedA,
    findFirstDifferentIndex(normalizedA, normalizedB)
  );

  // we update the word to be in it's un-normalized state
  return { ...closestWord, word: a.slice(closestWord.left, closestWord.right) };
};

/**
 * Find the first different word in two string.
 */
export const areStringsEqual = (a: string, b: string) => {
  return normalizeString(a) === normalizeString(b);
};

/**
 * Pluralize noun if appropriate
 */
export const maybePluralize = (
  count: number,
  noun: string,
  suffix: string = "s"
) => `${count} ${noun}${count !== 1 ? suffix : ""}`;

/**
 * Reutrns a random integer between two values, inclusive
 */
export const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Navigates back to the hierarchical parent URL.
 *
 * Navigates back with history.goBack() if last history state is also the hierarchical parent.
 * Otherwise navigates with history.push() or history.replace()
 *
 * RATIONALE:
 *
 * There are 2 ways to navigate back in an app:
 * 1) The APP navigation:
 *      - A back button or any programmatic in-app navigation.
 *      - Navigates based on the HIERARCHICAL order of pages.
 *      - Done by pushing an entry to the browser history. (*)
 * 2) The SYSTEM navigation:
 *      - The browser/mobile-OS back button.
 *      - Navigates based on the CHRONOLOGICAL order of pages.
 *      - Done by going to the previous entry in browser history.
 *
 * This function should be called every time the app wants to navigate to the parent URL. It handles
 * one edge case:
 *
 * (*) If the HIERARCHICAL and CHRONOLOGICAL previous pages are the same, then the navigation should be
 * made with history.goBack() instead of history.push(). This is because the UX is more consistent and
 * preserves the scroll positions.
 *
 * Based on https://developer.android.com/training/design-navigation/ancestral-temporal
 */
export const goBack = (
  history: Object,
  lastLocation: Object | null,
  parentURL: string,
  shouldPreserveCurrent: boolean = true
) => {
  const lastLocationIsParentURL =
    lastLocation && lastLocation.pathname === parentURL;

  if (lastLocationIsParentURL) {
    history.goBack();
  } else {
    if (shouldPreserveCurrent) {
      history.push(parentURL);
    } else {
      history.replace(parentURL);
    }
  }
};
