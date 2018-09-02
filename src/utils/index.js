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
