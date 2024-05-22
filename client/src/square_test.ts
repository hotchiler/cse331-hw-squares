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

  it("getSubtree", function () {
    // Create some squares to test with
    const s1 = split(
      solid("red"),
      solid("blue"),
      solid("white"),
      solid("purple")
    );
    const s2 = split(
      solid("purple"),
      split(solid("purple"), solid("red"), solid("green"), solid("blue")),
      solid("orange"),
      solid("green")
    );
    const s3 = split(
      solid("blue"),
      split(
        solid("blue"),
        solid("red"),
        solid("yellow"),
        split(solid("green"), solid("purple"), solid("orange"), solid("purple"))
      ),
      solid("purple"),
      solid("orange")
    );
    const s4 = split(
      solid("blue"),
      split(
        solid("blue"),
        solid("white"),
        solid("red"),
        split(
          split(solid("red"), solid("white"), solid("red"), solid("green")),
          solid("white"),
          solid("yellow"),
          solid("purple")
        )
      ),
      solid("purple"),
      solid("blue")
    );

    // 0-1-many heuristic - base case
    assert.deepStrictEqual(getSubtree(solid("red"), nil), solid("red"));

    // 0-1-many heuristic - base case
    assert.deepStrictEqual(getSubtree(s1, nil), s1);

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(getSubtree(s1, cons("NW", nil)), solid("red"));

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(getSubtree(s1, cons("NE", nil)), solid("blue"));

    // 0-1-many heuristic - >1 recursive call
    assert.deepStrictEqual(
      getSubtree(s2, cons("NE", cons("SW", nil))),
      solid("green")
    );

    // 0-1-many heuristic - >1 recursive call
    assert.deepStrictEqual(
      getSubtree(s3, cons("NE", cons("SE", cons("NW", nil)))),
      solid("green")
    );

    // All direction test
    assert.deepStrictEqual(
      getSubtree(s4, cons("NE", cons("SE", cons("NW", cons("NE", nil))))),
      solid("white")
    );
  });

  it("setSubtree", function () {
    // Create some squares to test with
    const s1 = split(
      solid("red"),
      solid("purple"),
      solid("orange"),
      solid("green")
    );
    const s2 = split(
      solid("red"),
      split(solid("red"), solid("orange"), solid("purple"), solid("blue")),
      solid("yellow"),
      solid("white")
    );
    const s3 = split(
      solid("red"),
      split(
        solid("red"),
        solid("blue"),
        solid("green"),
        split(solid("blue"), solid("white"), solid("orange"), solid("yellow"))
      ),
      solid("yellow"),
      solid("purple")
    );
    const s4 = split(
      solid("red"),
      split(
        solid("red"),
        solid("green"),
        solid("orange"),
        split(
          split(solid("red"), solid("purple"), solid("orange"), solid("green")),
          solid("white"),
          solid("red"),
          solid("blue")
        )
      ),
      solid("green"),
      solid("blue")
    );

    // 0-1-many heuristic - base case
    assert.deepStrictEqual(
      setSubtree(solid("red"), nil, solid("green")),
      solid("green")
    );

    // 0-1-many heuristic - base case
    assert.deepStrictEqual(setSubtree(s1, nil, solid("red")), solid("red"));

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(
      setSubtree(s1, cons("NW", nil), solid("white")),
      split(solid("white"), solid("purple"), solid("orange"), solid("green"))
    );

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(
      setSubtree(s1, cons("NE", nil), solid("blue")),
      split(solid("red"), solid("blue"), solid("orange"), solid("green"))
    );

    // 0-1-many heuristic - >1 recursive call
    assert.deepStrictEqual(
      setSubtree(s2, cons("NE", cons("SW", nil)), s1),
      split(
        solid("red"),
        split(solid("red"), solid("orange"), s1, solid("blue")),
        solid("yellow"),
        solid("white")
      )
    );

    // 0-1-many heuristic - >1 recursive call
    assert.deepStrictEqual(
      setSubtree(s3, cons("NE", cons("SE", cons("NW", nil))), s1),
      split(
        solid("red"),
        split(
          solid("red"),
          solid("blue"),
          solid("green"),
          split(s1, solid("white"), solid("orange"), solid("yellow"))
        ),
        solid("yellow"),
        solid("purple")
      )
    );

    // All direction test
    assert.deepStrictEqual(
      setSubtree(s4, cons("NE", cons("SE", cons("NW", cons("NE", nil)))), s3),
      split(
        solid("red"),
        split(
          solid("red"),
          solid("green"),
          solid("orange"),
          split(
            split(solid("red"), s3, solid("orange"), solid("green")),
            solid("white"),
            solid("red"),
            solid("blue")
          )
        ),
        solid("green"),
        solid("blue")
      )
    );
  });
});
