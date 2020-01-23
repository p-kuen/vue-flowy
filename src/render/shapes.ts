// source: https://github.com/dagrejs/dagre-d3/blob/master/lib/shapes.js

// const intersectRect = require("./intersect/intersect-rect");
// const intersectEllipse = require("./intersect/intersect-ellipse");
// const intersectCircle = require("./intersect/intersect-circle");
// const intersectPolygon = require("./intersect/intersect-polygon");

import {Node} from '../Graph'
import {BaseTypeSelection} from '../types/d3-extra'

export function rect(parent: BaseTypeSelection, bbox: DOMRect, node: Node) {
  var shapeSvg = parent.insert("rect", ":first-child")
    .attr("rx", node.rx || 0)
    .attr("ry", node.ry || 0)
    .attr("x", -bbox.width / 2)
    .attr("y", -bbox.height / 2)
    .attr("width", bbox.width)
    .attr("height", bbox.height);

  // node.intersect = function(point) {
  //   return intersectRect(node, point);
  // };

  return shapeSvg;
}

export function ellipse(parent: BaseTypeSelection, bbox: DOMRect, node: Node) {
  var rx = bbox.width / 2;
  var ry = bbox.height / 2;
  var shapeSvg = parent.insert("ellipse", ":first-child")
    .attr("x", -bbox.width / 2)
    .attr("y", -bbox.height / 2)
    .attr("rx", rx)
    .attr("ry", ry);

  // node.intersect = function(point) {
  //   return intersectEllipse(node, rx, ry, point);
  // };

  return shapeSvg;
}

export function circle(parent: BaseTypeSelection, bbox: DOMRect, node: Node) {
  var r = Math.max(bbox.width, bbox.height) / 2;
  var shapeSvg = parent.insert("circle", ":first-child")
    .attr("x", -bbox.width / 2)
    .attr("y", -bbox.height / 2)
    .attr("r", r);

  // node.intersect = function(point) {
  //   return intersectCircle(node, r, point);
  // };

  return shapeSvg;
}

// Circumscribe an ellipse for the bounding box with a diamond shape. I derived
// the function to calculate the diamond shape from:
// http://mathforum.org/kb/message.jspa?messageID=3750236
export function diamond(parent: BaseTypeSelection, bbox: DOMRect, node: Node) {
  var w = (bbox.width * Math.SQRT2) / 2;
  var h = (bbox.height * Math.SQRT2) / 2;
  var points = [
    { x:  0, y: -h },
    { x: -w, y:  0 },
    { x:  0, y:  h },
    { x:  w, y:  0 }
  ];
  var shapeSvg = parent.insert("polygon", ":first-child")
    .attr("points", points.map(function(p) { return p.x + "," + p.y; }).join(" "));

  // node.intersect = function(p) {
  //   return intersectPolygon(node, points, p);
  // };

  return shapeSvg;
}
