import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

/** Mapping between stringified non-zero digits (in English) and their numeric representation */
const StringDigitToNumericDigit = new Map([
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
]);

/** List of non-zero digits represented as English strings */
const StringDigits = Array.from(StringDigitToNumericDigit.keys());

/**
 * Extracts a number from the corrupted calibration value from the index provided and returns it.
 * Returns undefined if no number is found.
 * @param corruptedValue Corrupted entry from the calibration document that contains a calibration value
 * @param index Numeric index indicating the current place we're scanning in the corrupted value
 * @param checkForStringDigits Flag indicating if string digits should be checked in the input as well
 * @returns {number | undefined}
 */
const extractDigit = (
  corruptedValue: string,
  index: number,
  checkForStringDigits: boolean
): number | undefined => {
  // check if the character at the current index is a numeric number
  const possibleNumericDigit = +corruptedValue[index];
  if (!isNaN(possibleNumericDigit)) {
    return possibleNumericDigit;
  } else if (checkForStringDigits) {
    // check if a string number can be extracted from
    // the corrupted value starting at the current index
    const possibleStringDigit = StringDigits.find(
      (number) => number === corruptedValue.slice(index, index + number.length)
    );
    if (possibleStringDigit) {
      return StringDigitToNumericDigit.get(possibleStringDigit);
    }
  }
};

/**
 * Returns the sum of the calibration values
 * extracted from the corrupted calibration document.
 * @param {boolean} checkForStringDigits Flag indicating if string digits should be checked in the input as well
 * @returns {Promise<number>}
 */
const getTrebuchetCalibrationValues = async (
  checkForStringDigits: boolean
): Promise<number> => {
  const data: string = await readInput("day1.txt");

  let currentSum = 0;
  for (const corruptedValue of data.split("\n")) {
    let startingIndex = 0,
      endingIndex = corruptedValue.length - 1;
    while (startingIndex <= endingIndex) {
      const startingDigit = extractDigit(
        corruptedValue,
        startingIndex,
        checkForStringDigits
      );
      const endingDigit = extractDigit(
        corruptedValue,
        endingIndex,
        checkForStringDigits
      );

      if (startingDigit !== undefined && endingDigit !== undefined) {
        currentSum += +`${startingDigit}${endingDigit}`;
        break;
      }

      if (startingDigit === undefined) startingIndex++;
      if (endingDigit === undefined) endingIndex--;
    }
  }

  return currentSum;
};

export default {
  // Get the sum of the calibration values extracted from the corrupted document
  part1: () => getTrebuchetCalibrationValues(false),
  // Get the sum of the calibration values (including string digits) extracted from the corrupted document
  part2: () => getTrebuchetCalibrationValues(true),
} as DayAnswer;
