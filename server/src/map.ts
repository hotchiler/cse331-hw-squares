// TODO (Q5): 
//  a) Copy over your mutable map interface from HW7
//  b) Add a function that gets all the keys from the map
//  c) Create a class that implements the interface with a TS Map as its field
//  d) Implement a factory function that creates a new instance of the class

/**
 * Interface for a mutable map that allows setting, getting, and checking key-value pairs.
 * @template K - Type of keys in the map.
 * @template V - Type of values in the map.
 */
export interface MutableMap<K, V> {
    /**
     * Checks if there is some value associated with the given key in the map.
     * @param {K} key - The key to check for presence in the map.
     * @returns {boolean} - True if the key is present, false otherwise.
     */
    has: (key: K) => boolean;

    /**
     * Gets the value associated with the given key.
     * @param {K} key - The key whose value is to be retrieved.
     * @returns {V | undefined} - The value associated with the key, or undefined if the key is not present
     * @throws {Error} - If the key is not present in the map.
     */
    get: (key: K) => V | undefined;

    /**
     * Sets a value for the given key in the map, replacing the current value if the key already exists.
     * @param {K} key - The key to set the value for.
     * @param {V} value - The value to set for the key.
     * @returns {boolean} - True if a value was replaced, false if a new key-value pair was added.
     * @mofifies obj - The map object.
     * @effects obj - The map object is modified to include the new key-value pair.
     */
    set: (key: K, value: V) => boolean;

    /**
     * Clears all pairs from the map.
     * @modifies obj - The map object.
     * @effects obj - The map object is cleared of all key-value pairs.
     */
    clear: () => void;

    /**
     * Gets all the keys from the map.
     * @returns {Array<string>} - An array containing all keys in the map.
     */
    getAllKeys: () => Array<string>;
}

/**
 * Implementation of the MutableMap interface using TypeScript's built-in Map.
 * @template K - Type of keys in the map.
 * @template V - Type of values in the map.
 * @class
 */
class TSMapMutableMap<K, V> implements MutableMap<K, V> {
    private map: Map<K, V>;

    /**
     * Constructs an empty TSMapMutableMap.
     * @constructor
     */
    constructor() {
        this.map = new Map<K, V>();
    }

    /**
     * Abstraction Function:
     * AF(map) = a mutable map where the key-value pairs are stored in a TypeScript Map object.
     */

    /**
     * Checks if there is some value associated with the given key in the map.
     * @param {K} key - The key to check for presence in the map.
     * @returns {boolean} - True if the key is present, false otherwise.
     */
    has = (key: K): boolean => {
        return this.map.has(key);
    }

    /**
     * Gets the value associated with the given key.
     * @param {K} key - The key whose value is to be retrieved.
     * @returns {V | undefined} - The value associated with the key, or undefined if the key is not present.
     */
    get = (key: K): V | undefined => {
        return this.map.get(key);
    }

    /**
     * Sets a value for the given key in the map, replacing the current value if the key already exists.
     * @param {K} key - The key to set the value for.
     * @param {V} value - The value to set for the key.
     * @returns {boolean} - True if a value was replaced, false if a new key-value pair was added.
     */
    set = (key: K, value: V): boolean => {
        const keyExists = this.has(key);
        this.map.set(key, value);
        return keyExists;
    }

    /**
     * Clears all pairs from the map.
     */
    clear = (): void => {
        this.map.clear();
    }

    /**
     * Gets all the keys from the map.
     * @returns {Array<string>} - An array containing all keys in the map.
     */
    getAllKeys = (): Array<string> => {
        return Array.from(this.map.keys()).map(key => String(key));
    }
}

/**
 * Factory function to create a new instance of a MutableMap.
 * @template K - Type of keys in the map.
 * @template V - Type of values in the map.
 * @returns {MutableMap<K, V>} - A new instance of MutableMap.
 */
export const createMutableMap = <K, V>(): MutableMap<K, V> => {
    return new TSMapMutableMap<K, V>();
};