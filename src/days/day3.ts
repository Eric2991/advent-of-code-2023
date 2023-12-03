import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

const Directions: ReadonlyArray<[number, number]> = [
  [-1, -1], // top left
  [-1, 0], // top
  [-1, 1], // top right
  [0, -1], // left
  [0, 1], // right
  [1, -1], // bottom left
  [1, 0], // bottom
  [1, 1], // bottom right
];

const adjacentSymbolCoordinates = (
  rows: string[],
  rowIndex: number,
  colIndex: number,
  regExpToTest: RegExp = /[#!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/
): [number, number] | undefined => {
  for (const [row, col] of Directions) {
    // we only need to guard against out-of-bound references on the array
    // out-of-bounds references on strings will yield undefined and not throw
    if (rowIndex + row >= 0 && rowIndex + row < rows.length) {
      if (regExpToTest.test(rows[rowIndex + row][colIndex + col])) {
        return [rowIndex + row, colIndex + col];
      }
    }
  }
};

/**
 * Gets the sum of all of the part numbers in the engine schematic
 * @returns {Promise<number>}
 */
const getPartNumberSum = async (): Promise<number> => {
  const buffer: string = await readInput("day3.txt");
  let sum = 0,
    isValid = false,
    numberBuffer = "";

  const flushPartNumber = () => {
    if (isValid) {
      sum += +numberBuffer;
      isValid = false;
    }
    numberBuffer = "";
  };

  const rows = buffer.split("\n");
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];

    // flush the buffer carried over from the previous row
    flushPartNumber();

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const character = row[colIndex];
      if (isNaN(+character)) {
        // character is not a digit
        flushPartNumber();
      } else {
        // character is a digit, add it to the string buffer
        numberBuffer += character;
        if (!isValid && adjacentSymbolCoordinates(rows, rowIndex, colIndex)) {
          isValid = true;
        }
      }
    }
  }

  // flush the buffer carried over from the last row
  flushPartNumber();

  return sum;
};

/**
 * Gets the sum of all of the gear ratios in the engine schematic
 * @returns {Promise<number>}
 */
const getGearRatioSum = async (): Promise<number> => {
  const buffer: string = await readInput("day3.txt");
  let gearCoordinates: [number, number] | undefined = undefined,
    numberBuffer = "";

  const gearNumbers: { [key: string]: number[] } = {};

  const flushGearEntry = () => {
    if (gearCoordinates) {
      (gearNumbers[gearCoordinates.join("-")] ??= []).push(+numberBuffer);
      gearCoordinates = undefined;
    }
    numberBuffer = "";
  };

  const rows = buffer.split("\n");
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];

    // flush the buffer carried over from the previous row
    flushGearEntry();

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const character = row[colIndex];
      if (isNaN(+character)) {
        // character is not a digit
        flushGearEntry();
      } else {
        // character is a digit, add it to the string buffer
        numberBuffer += character;
        if (!gearCoordinates) {
          gearCoordinates = adjacentSymbolCoordinates(
            rows,
            rowIndex,
            colIndex,
            /[*]/
          );
        }
      }
    }
  }

  // flush the buffer carried over from the last row
  flushGearEntry();

  return Object.values(gearNumbers).reduce(
    (sum, values) => (values.length === 2 ? sum + values[0] * values[1] : sum),
    0
  );
};

export default {
  // Gets the sum of all of the part numbers in the engine schematic
  part1: () => getPartNumberSum(),
  // Gets the sum of all of the gear ratios in the engine schematic
  part2: () => getGearRatioSum(),
} as DayAnswer;
