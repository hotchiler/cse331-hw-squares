import * as assert from 'assert';
import { createMutableMap, MutableMap } from './map';

describe('MutableMap', function() {
    let map: MutableMap<string, number>;

    beforeEach(() => map = createMutableMap<string, number>());

    describe('has', function() {
        it('should return false for a key not in the map (base case, 0 recursive calls)', function() {
            assert.strictEqual(map.has('a'), false);
            assert.strictEqual(map.has('b'), false);
        });

        it('should return true for a key in the map (base case, 0 recursive calls)', function() {
            map.set('a', 1);
            assert.strictEqual(map.has('a'), true);
            assert.strictEqual(map.has('b'), false);
        });

        it('should return true or false for keys in the map (1 recursive call)', function() {
            map.set('a', 1);
            map.set('b', 2);
            assert.strictEqual(map.has('a'), true);
            assert.strictEqual(map.has('b'), true);
            assert.strictEqual(map.has('c'), false);
        });

        it('should return true or false for keys in the map (2+ recursive calls)', function() {
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            map.set('d', 4);
            assert.strictEqual(map.has('a'), true);
            assert.strictEqual(map.has('b'), true);
            assert.strictEqual(map.has('c'), true);
            assert.strictEqual(map.has('d'), true);
            assert.strictEqual(map.has('e'), false);
        });
    });

    describe('get', function() {
        it('should return undefined for a key not in the map (base case, 0 recursive calls)', function() {
            assert.strictEqual(map.get('a'), undefined);
            assert.strictEqual(map.get('b'), undefined);
        });

        it('should return the value for a key in the map (base case, 0 recursive calls)', function() {
            map.set('a', 1);
            assert.strictEqual(map.get('a'), 1);
            assert.strictEqual(map.get('b'), undefined);
        });

        it('should return the value for keys in the map (1 recursive call)', function() {
            map.set('a', 1);
            map.set('b', 2);
            assert.strictEqual(map.get('a'), 1);
            assert.strictEqual(map.get('b'), 2);
            assert.strictEqual(map.get('c'), undefined);
        });

        it('should return the value for keys in the map (2+ recursive calls)', function() {
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            map.set('d', 4);
            assert.strictEqual(map.get('a'), 1);
            assert.strictEqual(map.get('b'), 2);
            assert.strictEqual(map.get('c'), 3);
            assert.strictEqual(map.get('d'), 4);
            assert.strictEqual(map.get('e'), undefined);
        });
    });

    describe('set', function() {
        it('should add a new key-value pair and return false (base case, 0 recursive calls)', function() {
            assert.strictEqual(map.set('a', 1), false);
            assert.strictEqual(map.get('a'), 1);
        });

        it('should replace the value of an existing key and return true (base case, 0 recursive calls)', function() {
            map.set('a', 1);
            assert.strictEqual(map.set('a', 2), true);
            assert.strictEqual(map.get('a'), 2);
        });

        it('should add or update key-value pairs and return correct boolean (1 recursive call)', function() {
            map.set('a', 1);
            map.set('b', 2);
            assert.strictEqual(map.set('a', 3), true);
            assert.strictEqual(map.set('b', 4), true);
            assert.strictEqual(map.set('c', 5), false);
            assert.strictEqual(map.get('a'), 3);
            assert.strictEqual(map.get('b'), 4);
            assert.strictEqual(map.get('c'), 5);
        });

        it('should add or update key-value pairs and return correct boolean (2+ recursive calls)', function() {
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            map.set('d', 4);
            assert.strictEqual(map.set('a', 5), true);
            assert.strictEqual(map.set('b', 6), true);
            assert.strictEqual(map.set('c', 7), true);
            assert.strictEqual(map.set('d', 8), true);
            assert.strictEqual(map.set('e', 9), false);
            assert.strictEqual(map.get('a'), 5);
            assert.strictEqual(map.get('b'), 6);
            assert.strictEqual(map.get('c'), 7);
            assert.strictEqual(map.get('d'), 8);
            assert.strictEqual(map.get('e'), 9);
        });
    });

    describe('clear', function() {
        it('should remove all key-value pairs from the map (base case, 0 recursive calls)', function() {
            map.clear();
            assert.strictEqual(map.has('a'), false);
            assert.strictEqual(map.has('b'), false);
        });

        it('should remove all key-value pairs from the map (1 recursive call)', function() {
            map.set('a', 1);
            map.clear();
            assert.strictEqual(map.has('a'), false);
        });

        it('should remove all key-value pairs from the map (2+ recursive calls)', function() {
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            map.clear();
            assert.strictEqual(map.has('a'), false);
            assert.strictEqual(map.has('b'), false);
            assert.strictEqual(map.has('c'), false);
        });
    });

    describe('getAllKeys', function() {
        it('should return an empty array for an empty map', function() {
            assert.deepStrictEqual(map.getAllKeys(), []);
        });

        it('should return an array with one key for a map with one key-value pair', function() {
            map.set('a', 1);
            assert.deepStrictEqual(map.getAllKeys(), ['a']);
        });

        it('should return an array with multiple keys for a map with multiple key-value pairs', function() {
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            assert.deepStrictEqual(map.getAllKeys(), ['a', 'b', 'c']);
        });

        it('should return an array with the correct keys after updates', function() {
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            map.set('a', 4); // Update existing key
            map.set('d', 5);
            assert.deepStrictEqual(map.getAllKeys(), ['a', 'b', 'c', 'd']);
        });

        it('should return an empty array after clearing the map', function() {
            map.set('a', 1);
            map.set('b', 2);
            map.clear();
            assert.deepStrictEqual(map.getAllKeys(), []);
        });
    });
});
