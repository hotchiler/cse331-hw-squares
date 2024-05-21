import * as assert from 'assert';
import { solid, split, toJson, fromJson, getSubtree, setSubtree } from './square';
import { cons, nil } from './list';

describe('square', function() {

  it('toJson', function() {
    assert.deepStrictEqual(toJson(solid("white")), "white");
    assert.deepStrictEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepStrictEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepStrictEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepStrictEqual(fromJson("white"), solid("white"));
    assert.deepStrictEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepStrictEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepStrictEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

  it('getSubtree', function() {
    const square1 = split(solid("blue"), solid("red"), solid("orange"), solid("green"));
    const square2 = split(solid("purple"), split(solid("purple"), solid("red"), solid("orange"), solid("blue")),
                      solid("green"), solid("orange"));
    const square3 = split(solid("blue"), split(solid("blue"), solid("red"), solid("yellow"),
                    split(solid("green"), solid("purple"), solid("orange"), solid("purple"))), solid("purple"), solid("orange"));
    const square4 = split(solid("blue"), split(solid("blue"), solid("white"), solid("red"),
                    split(split(solid("blue"), solid("white"), solid("red"), solid("green")),
                                solid("white"), solid("yellow"), solid("purple"))),
                                solid("purple"), solid("red"));

    // 0-1-many heuristic - base case: nil path
    assert.deepStrictEqual(getSubtree(solid("red"), nil), solid("red"));

    // 0-1-many heuristic - base case: nil path
    assert.deepStrictEqual(getSubtree(square1, nil), square1);

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(getSubtree(square1, cons("NW", nil)), solid("blue"));

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(getSubtree(square1, cons("NE", nil)), solid("red"));

    // 0-1-many heuristic - >1 recursive call
    assert.deepStrictEqual(getSubtree(square2, cons("NE", cons("SW", nil))), solid("orange"));

    // 0-1-many heuristic - >1 recursive call
    assert.deepStrictEqual(getSubtree(square3, cons("NE", cons("SE", cons("NW", nil)))), solid("green"));

    // All direction test
    assert.deepStrictEqual(getSubtree(square4, cons("NE", cons("SE", cons("NW", cons("NE", nil))))), solid("white"));

});
  it('setSubtree', function() { 

  })});
