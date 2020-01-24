import { select } from 'd3-selection';

var flowElementsById = {};
var FlowElement = /** @class */ (function () {
    function FlowElement(id, options) {
        this.edges = [];
        this.listeners = [];
        this.id = id;
        this.options = Object.assign({}, options);
        this.register();
    }
    FlowElement.getById = function (id) {
        return flowElementsById[id];
    };
    FlowElement.prototype.leadsTo = function (destinationElement, options) {
        this.edges.push({ otherId: destinationElement.id, options: options });
        return destinationElement;
    };
    FlowElement.prototype.unregister = function () {
        delete flowElementsById[this.id];
    };
    FlowElement.prototype.register = function () {
        if (flowElementsById[this.id]) {
            throw new Error('ID ' + this.id + 'is already registered!');
        }
        flowElementsById[this.id] = this;
    };
    FlowElement.prototype.on = function (event, callback) {
        this.listeners.push({ event: event, callback: callback });
    };
    return FlowElement;
}());
//# sourceMappingURL=FlowElement.js.map

var delimiter = '\x01';
function edgeArgsToId(directed, fromId, toId, name) {
    if (!directed && fromId > toId) {
        fromId = toId;
        toId = fromId;
    }
    return fromId + delimiter + toId + delimiter + (name || '');
}
var Graph = /** @class */ (function () {
    function Graph(options) {
        var _a, _b, _c, _d;
        this.nodes = {};
        this.edges = {};
        this.directed = (_b = (_a = options) === null || _a === void 0 ? void 0 : _a.directed, (_b !== null && _b !== void 0 ? _b : false));
        this.compound = (_d = (_c = options) === null || _c === void 0 ? void 0 : _c.compound, (_d !== null && _d !== void 0 ? _d : false));
    }
    Graph.prototype.setGraph = function (graph) {
        this.graph = graph;
        return this;
    };
    Graph.prototype.setNode = function (id, options) {
        var defaultOptions = {
            x: 0,
            y: 0,
            width: 10,
            height: 10,
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            children: {},
            inEdges: {},
            outEdges: {},
            predecessors: {},
            successors: {},
            labelType: 'text',
            order: 0
        };
        this.nodes[id] = Object.assign(defaultOptions, options);
        return this;
    };
    Graph.prototype.node = function (id) {
        return this.nodes[id];
    };
    Graph.prototype.hasNode = function (id) {
        return this.nodes[id] !== undefined;
    };
    Object.defineProperty(Graph.prototype, "nodeIds", {
        get: function () {
            return Object.keys(this.nodes);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graph.prototype, "nodeObjects", {
        get: function () {
            return Object.values(this.nodes);
        },
        enumerable: true,
        configurable: true
    });
    Graph.prototype.setEdge = function (fromId, toId, options) {
        var id = this.createEdgeId(fromId, toId);
        var fromNode = this.node(fromId);
        var toNode = this.node(toId);
        var defaultOptions = {
            fromId: fromId,
            toId: toId,
            minlen: 0,
            weight: 1
        };
        var edgeObject = Object.assign(defaultOptions, options);
        fromNode.outEdges[id] = edgeObject;
        toNode.inEdges[id] = edgeObject;
        this.edges[id] = edgeObject;
    };
    Graph.prototype.edge = function (childId, parentId, name) {
        var edgeId = edgeArgsToId(this.directed, childId, parentId, name);
        return this.edges[edgeId];
    };
    Object.defineProperty(Graph.prototype, "edgeIds", {
        get: function () {
            return Object.keys(this.edges);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graph.prototype, "edgeObjects", {
        get: function () {
            return Object.values(this.edges);
        },
        enumerable: true,
        configurable: true
    });
    Graph.prototype.inEdgeObjects = function (id, fromId) {
        var inEdges = this.nodes[id].inEdges;
        if (!inEdges) {
            return [];
        }
        var inEdgeObjects = Object.values(inEdges);
        if (!fromId) {
            return inEdgeObjects;
        }
        return inEdgeObjects.filter(function (edge) { return edge.fromId === fromId; });
    };
    Graph.prototype.outEdgeObjects = function (id, toId) {
        var outEdges = this.nodes[id].outEdges;
        if (!outEdges) {
            return [];
        }
        var outEdgeObjects = Object.values(outEdges);
        if (!toId) {
            return outEdgeObjects;
        }
        return outEdgeObjects.filter(function (edge) { return edge.toId === toId; });
    };
    Graph.prototype.nodeEdgeObjects = function (fromId, toId) {
        var inEdges = this.inEdgeObjects(fromId, toId);
        var outEdges = this.outEdgeObjects(fromId, toId);
        return inEdges.concat(outEdges);
    };
    Graph.prototype.hasEdge = function (fromId, toId, name) {
        var edgeId = edgeArgsToId(this.directed, fromId, toId, name);
        return this.edges[edgeId] !== undefined;
    };
    Graph.prototype.predecessors = function (id) {
        var nodes = this.node(id).predecessors;
        return Object.keys(nodes);
    };
    Graph.prototype.successors = function (id) {
        var nodes = this.node(id).successors;
        return Object.keys(nodes);
    };
    Graph.prototype.neighbors = function (id) {
        var predecessors = this.predecessors(id);
        var successors = this.successors(id);
        return predecessors.concat(successors);
    };
    Object.defineProperty(Graph.prototype, "rootNodeIds", {
        get: function () {
            var _this = this;
            return this.nodeIds.filter(function (id) { return Object.keys(_this.node(id).inEdges).length === 0; });
        },
        enumerable: true,
        configurable: true
    });
    Graph.prototype.createEdgeId = function (fromId, toId) {
        return fromId + delimiter + toId;
    };
    return Graph;
}());
//# sourceMappingURL=Graph.js.map

function addLabel(labelGroup, node) {
    var labelText = node.label;
    var svg = labelGroup.append('g');
    switch (node.labelType) {
        case 'text':
            addTextLabel(svg, node);
            break;
        default:
            throw new Error("Node label type " + node.labelType + " is not implemented!");
    }
    var labelBBox = svg.node().getBBox();
    var y = (-labelBBox.height / 2);
    svg.attr('transform', "translate(" + -labelBBox.width / 2 + "," + y + ")");
    return svg;
}
function addTextLabel(svg, node) {
    var textSvg = svg.append('text');
    var lines = processEscapeSequences(node.label).split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        textSvg.append('tspan')
            .attr('xml:space', 'preserve')
            .attr('dy', '1em')
            .attr('x', '1')
            .text(line);
    }
    return textSvg;
}
function processEscapeSequences(text) {
    var newText = "";
    var escaped = false;
    var ch;
    for (var i = 0; i < text.length; ++i) {
        ch = text[i];
        if (escaped) {
            switch (ch) {
                case "n":
                    newText += "\n";
                    break;
                default: newText += ch;
            }
            escaped = false;
        }
        else if (ch === "\\") {
            escaped = true;
        }
        else {
            newText += ch;
        }
    }
    return newText;
}
//# sourceMappingURL=label.js.map

// source: https://github.com/dagrejs/dagre-d3/blob/master/lib/shapes.js
function rect(parent, bbox, node) {
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
function ellipse(parent, bbox, node) {
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
function circle(parent, bbox, node) {
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
function diamond(parent, bbox, node) {
    var w = (bbox.width * Math.SQRT2) / 2;
    var h = (bbox.height * Math.SQRT2) / 2;
    var points = [
        { x: 0, y: -h },
        { x: -w, y: 0 },
        { x: 0, y: h },
        { x: w, y: 0 }
    ];
    var shapeSvg = parent.insert("polygon", ":first-child")
        .attr("points", points.map(function (p) { return p.x + "," + p.y; }).join(" "));
    // node.intersect = function(p) {
    //   return intersectPolygon(node, points, p);
    // };
    return shapeSvg;
}
//# sourceMappingURL=shapes.js.map

var shapes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  rect: rect,
  ellipse: ellipse,
  circle: circle,
  diamond: diamond
});

function createNodes(selection, graph) {
    var nodeGroups = selection.selectAll("g.node").data(graph.nodeIds, function (k) { return k; });
    nodeGroups.enter().append('g').attr('class', 'node');
    // I do not exactly know why we have to select them again now. 
    nodeGroups = selection.selectAll("g.node");
    nodeGroups.each(function (id) {
        var _a;
        var node = graph.node(id);
        var group = select(this);
        var labelGroup = group.append('g').attr('class', 'label');
        var labelSvg = addLabel(labelGroup, node);
        var bbox = labelSvg.node().getBBox();
        var shape = shapes[node.shape || 'rect'];
        node.svg = this;
        bbox.width += node.padding.left + node.padding.right;
        bbox.height += node.padding.top + node.padding.bottom;
        labelGroup.attr('transform', "translate(" + ((node.padding.left - node.padding.right) / 2) + "," + ((node.padding.top - node.padding.bottom) / 2) + ")");
        var shapeSvg = shape(group, bbox, node);
        var shapeBBox = (_a = shapeSvg.node()) === null || _a === void 0 ? void 0 : _a.getBBox();
        node.width = shapeBBox.width;
        node.height = shapeBBox.height;
    });
    return nodeGroups;
}
function positionNodes(selection, graph) {
    function translate(id) {
        var node = graph.node(id);
        return "translate(" + node.x + "," + node.y + ")";
    }
    selection.attr('transform', translate);
}
//# sourceMappingURL=nodes.js.map

function maxRank(graph) {
    return Math.max.apply(Math, graph.nodeObjects.map(function (n) { return n.rank || 0; }));
}
function buildLayerMatrix(graph) {
    var layering = new Array(maxRank(graph) + 1).map(function () { return []; });
    for (var _i = 0, _a = graph.nodeIds; _i < _a.length; _i++) {
        var id = _a[_i];
        var node = graph.node(id);
        var rank = node.rank;
        if (rank !== undefined) {
            layering[rank][node.order] = id;
        }
    }
    return layering;
}
//# sourceMappingURL=layer.js.map

function positionY(graph) {
    var layers = buildLayerMatrix(graph);
    var rankSep = /*graph.graph?.ranksep*/ 0;
    var prevY = 0;
    for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
        var layer = layers_1[_i];
        var maxHeight = Math.max.apply(Math, layer.map(function (id) { return graph.node(id).height; }));
        for (var _a = 0, layer_1 = layer; _a < layer_1.length; _a++) {
            var id = layer_1[_a];
            graph.node(id).y = prevY + maxHeight / 2;
        }
        prevY += maxHeight + rankSep;
    }
}
function position(graph) {
    positionY(graph);
    // for (const iterator of positionX(graph)) {
    // }
}
//# sourceMappingURL=position.js.map

function layout(graph) {
    // const layoutGraph = buildLayoutGraph(graph)
    _layout(graph);
    // updateInputGraph(graph, layoutGraph)
}
function _layout(graph) {
    position(graph);
    // translateGraph(graph)
}
/*
 * This idea comes from the Gansner paper: to account for edge labels in our
 * layout we split each rank in half by doubling minlen and halving ranksep.
 * Then we can place labels at these mid-points between nodes.
 *
 * We also add some minimal padding to the width to push the label for the edge
 * away from the edge itself a bit.
 */
// function makeSpaceForEdgeLabels<T extends string>(g: Graph<T>) {
//   const graph = g.graph
//   graph.ranksep /= 2
//   for (const e of g.edgeIds) {
//     const edge = g.edge(e)
//   }
//   _.forEach(g.edges(), function (e) {
//     const edge = g.edge(e)
//     edge.minlen *= 2
//     if (edge.labelpos.toLowerCase() !== 'c') {
//       if (graph.rankdir === 'TB' || graph.rankdir === 'BT') {
//         edge.width += edge.labeloffset
//       } else {
//         edge.height += edge.labeloffset
//       }
//     }
//   })
// }
//# sourceMappingURL=layout.js.map

var Renderer = /** @class */ (function () {
    function Renderer(graph) {
        this.graph = graph;
    }
    Renderer.prototype.preprocess = function () {
        for (var _i = 0, _a = this.graph.nodeIds; _i < _a.length; _i++) {
            var id = _a[_i];
            var node = this.graph.node(id);
            console.log('TODO: do pre-processing.');
        }
    };
    Renderer.prototype.render = function (element, graph) {
        // delete everything from element
        element.selectAll().remove();
        var nodes = createNodes(element.append('g').attr('class', 'nodes'), graph);
        layout(graph);
        positionNodes(nodes, graph);
    };
    return Renderer;
}());

// import * as d3Renderer from 'dagre-d3-renderer'
var FlowChart = /** @class */ (function () {
    function FlowChart(options) {
        this.options = {
            direction: 'LR'
        };
        this.elements = [];
        this.options = Object.assign(this.options, options);
    }
    FlowChart.prototype.addElement = function (id, options) {
        console.log('add element');
        var el = new FlowElement(id, options);
        this.elements.push(el);
        return el;
    };
    FlowChart.prototype.destroy = function () {
        this.elements.forEach(function (element) { element.unregister(); });
    };
    FlowChart.prototype.render = function (element) {
        var _a;
        var svg = select(element)
            .append('svg')
            .attr('id', 'f' + element.id)
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('width', 1000)
            .attr('height', 600);
        var svgGroup = svg.append('g');
        // Create the input graph
        var g = new Graph({
            multigraph: true,
            compound: true
        })
            .setGraph({
            rankdir: this.options.direction,
            marginx: 20,
            marginy: 20
        });
        // .setDefaultEdgeLabel(function () {
        //   return {}
        // })
        // first create all nodes
        for (var i in this.elements) {
            var el = this.elements[i];
            var elData = {
                label: el.id
            };
            if ((_a = el.options) === null || _a === void 0 ? void 0 : _a.label) {
                elData.label = el.options.label;
            }
            g.setNode(el.id, elData);
            var node = g.node(el.id);
            // apply some styles
            node.rx = node.ry = 5;
            // now create all edges
            for (var k in el.edges) {
                var edge = el.edges[k];
                var edgeData = {};
                if (edge.options && edge.options.label) {
                    edgeData.label = edge.options.label;
                }
                g.setEdge(el.id, edge.otherId, edgeData);
            }
        }
        var renderer = new Renderer(g);
        var e = select('#f' + element.id + ' g');
        renderer.render(e, g);
        var svgElement = document.getElementById('f' + element.id);
        // now add the listeners after render
        // e.selectAll('g.node')
        //   .each(function(v) {
        //     // get the flow element from the id
        //     const el = FlowElement.getById(v as string)
        //     if (!el) {
        //       throw new Error('Element with id ' + v + ' is not defined!')
        //     }
        //     const d3Node = select(this)
        //     // now loop all listeners
        //     for (const listener of el.listeners) {
        //       d3Node.on(listener.event, listener.callback)
        //     }
        //   })
        if (!svgElement) {
            throw new Error('svgElement is null!');
        }
        var groupElement = svgElement.querySelector('g');
        if (!groupElement) {
            throw new Error('groupElement is null!');
        }
        svgElement.setAttribute('width', (groupElement.getBoundingClientRect().width + 40).toString());
        svgElement.setAttribute('height', (groupElement.getBoundingClientRect().height + 40).toString());
    };
    return FlowChart;
}());
//# sourceMappingURL=FlowChart.js.map

export default FlowChart;
