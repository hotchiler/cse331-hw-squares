import { List, nil } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

/** 
 * Converts a string to a color (or throws an exception if not a color). 
 * @param s string to convert to color
 */
export const toColor = (s: string): Color => {
  switch (s) {
    case "white": case "red": case "orange": case "yellow":
    case "green": case "blue": case "purple":
      return s;

    default:
      throw new Error(`unknown color "${s}"`);
  }
};

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

/** 
 * Returns a solid square of the given color. 
 * @param color of square to return
 * @returns square of given color
 */
export const solid = (color: Color): Square => {
  return {kind: "solid", color: color};
};

/** 
 * Returns a square that splits into the four given parts. 
 * @param nw square in nw corner of returned square
 * @param ne square in ne corner of returned square
 * @param sw square in sw corner of returned square
 * @param se square in se corner of returned square
 * @returns new square composed of given squares
 */
export const split =
    (nw: Square, ne: Square, sw: Square, se: Square): Square => {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
};

export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;


/** 
 * Creats a JSON representation of given Square. 
 * @param sq to convert to JSON
 * @returns JSON describing the given square
 */
export const toJson = (sq: Square): unknown => {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
};

/** 
 * Converts a JSON description to the Square it describes. 
 * @param data in JSON form to try to parse as Square
 * @returns a Square parsed from given data
 */
export const fromJson = (data: unknown): Square => {
  if (typeof data === 'string') {
    return solid(toColor(data))
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}

  /**
 * Retrieves the root of the subtree at the specified path within a given square.
 * @param sq The square to navigate.
 * @param path The path to the desired subtree root.
 * @returns The subtree root at the specified path.
 * @throws An error if direction is invalid.
 */
  export const getSubtree = (sq: Square, path: Path): Square => {
    if (path.kind === "nil" || sq.kind === "solid"){
      return sq;
    } else {
      const dir = path.hd;
      switch (dir) {
        case "NW":
        return getSubtree(sq.nw, path.tl);
        case "NE":
        return getSubtree(sq.ne, path.tl);
        case "SW":
        return getSubtree(sq.sw, path.tl);
        case "SE":
        return getSubtree(sq.se, path.tl);
        default:
          throw new Error(`Invalid direction ${dir}`);
      }
    }
  };

  /**
 * Replaces the subtree at the specified path within a given square with a new square.
 * @param sq The original square.
 * @param path The path to the subtree root to be replaced.
 * @param newSubtree The new subtree to replace the existing one.
 * @returns A new square with the specified subtree replaced.
 * @throws An error if the path leads to a non-existent subtree.
 */
  export const setSubtree = (sq: Square, path: Path, newSubtree: Square): Square => {
    if (path.kind === "nil" || sq.kind === "solid") {
      return newSubtree;
    }
    if (sq.kind !== "split") {
      throw new Error('Cannot set subtree on a non-split square');
    }
    switch(path.hd){
      case "NW":
        return split(setSubtree(sq.nw, path.tl, newSubtree), sq.ne, sq.sw, sq.se);
      case "NE":
        return split(sq.nw, setSubtree(sq.ne, path.tl, newSubtree), sq.sw, sq.se);
      case "SW":
        return split(sq.nw, sq.ne, setSubtree(sq.sw, path.tl, newSubtree), sq.se);
      case "SE":
        return split(sq.nw, sq.ne, sq.sw, setSubtree(sq.se, path.tl, newSubtree));
      default:
              throw new Error('Invalid direction');
          }
        };
