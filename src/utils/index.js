// @flow
import DiffMatchPatch from "diff-match-patch";

import type { WordInString, DiffText } from "../types";

/**
 * Pluralize noun if appropriate
 */
export const maybePluralize = (
  count: number,
  noun: string,
  suffix: string = "s"
) => `${count} ${noun}${count !== 1 ? suffix : ""}`;

/**
 * Returns a random integer between two values, inclusive
 */
export const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const diffMatchPatch = new DiffMatchPatch();

export const getDiffText = (
  userAnswer: string,
  correctAnswer: string
): DiffText[] => {
  const diff = diffMatchPatch.diff_main(
    normalizeString(correctAnswer),
    normalizeString(userAnswer)
  );

  diffMatchPatch.diff_cleanupSemantic(diff);

  return diff;
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
