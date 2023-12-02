import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

const MaxCubes = new Map([
  ["red", 12],
  ["green", 13],
  ["blue", 14],
]);

/**
 * Gets the sum of the IDs of the games that would have been possible if the
 * bag had been loaded with the number of cubes specified in {@link MaxCubes}
 * @returns {Promise<number>}
 */
const getGameIdSum = async (): Promise<number> => {
  const buffer: string = await readInput("day2.txt");
  let gameIdSum = 0;
  for (const gameDescription of buffer.split("\n")) {
    const [, gameId, game] = gameDescription.match(/Game (\d+): (.*)/);
    const sets = game.split(";");
    const isPossible = sets.every((set) => {
      const cubeTypes = set.split(",");
      return cubeTypes.every((cubeType) => {
        const [, numberOfCubes, cubeColor] = cubeType.match(/(\d+) ([a-z]+)/);
        const maxNumberOfCubes =
          MaxCubes.get(cubeColor) ?? Number.POSITIVE_INFINITY;
        return +numberOfCubes <= maxNumberOfCubes;
      });
    });
    if (isPossible) {
      gameIdSum += +gameId;
    }
  }
  return gameIdSum;
};

/**
 * Gets the sum of the power for each of the sets of cubes in each game
 * @returns {Promise<number>}
 */
const getGamePowerSum = async (): Promise<number> => {
  const buffer: string = await readInput("day2.txt");
  let powerSum = 0;
  for (const gameDescription of buffer.split("\n")) {
    const [, , game] = gameDescription.match(/Game (\d+): (.*)/);
    const cubeTypeMinimums = new Map([
      ["red", 0],
      ["green", 0],
      ["blue", 0],
    ]);
    for (const set of game.split(";")) {
      for (const cubeType of set.split(",")) {
        const [, numberOfCubes, cubeColor] = cubeType.match(/(\d+) ([a-z]+)/);
        if (cubeTypeMinimums.get(cubeColor) < +numberOfCubes) {
          cubeTypeMinimums.set(cubeColor, +numberOfCubes);
        }
      }
    }

    powerSum += Array.from(cubeTypeMinimums.values()).reduce(
      (result, min) => result * min,
      1
    );
  }
  return powerSum;
};

export default {
  // Gets the sum of the IDs of the games
  part1: () => getGameIdSum(),
  // Gets the sum of the power of each set of cubes
  part2: () => getGamePowerSum(),
} as DayAnswer;
