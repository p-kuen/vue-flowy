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
            id: id,
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

/*
 * Initializes ranks for the input graph using the longest path algorithm. This
 * algorithm scales well and is fast in practice, it yields rather poor
 * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
 * ranks wide and leaving edges longer than necessary. However, due to its
 * speed, this algorithm is good for getting an initial ranking that can be fed
 * into other algorithms.
 *
 * This algorithm does not normalize layers because it will be used by other
 * algorithms in most cases. If using this algorithm directly, be sure to
 * run normalize at the end.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG.
 *    2. Input graph node labels can be assigned properties.
 *
 * Post-conditions:
 *
 *    1. Each node will be assigned an (unnormalized) "rank" property.
 */
function longestPath(graph) {
    var visited = {};
    function dfs(id) {
        var node = graph.node(id);
        if (visited[id]) {
            return node.rank;
        }
        visited[id] = true;
        var rank = Math.min.apply(Math, graph.outEdgeObjects(id).map(function (edge) { return dfs(edge.toId) - edge.minlen; }));
        console.log('new rank for node', id, rank);
        if (rank === Number.POSITIVE_INFINITY || // return value of _.map([]) for Lodash 3
            rank === undefined || // return value of _.map([]) for Lodash 4
            rank === null) { // return value of _.map([null])
            rank = 0;
        }
        return (node.rank = rank);
    }
    console.log('root nodes', graph.rootNodeIds);
    for (var _i = 0, _a = graph.rootNodeIds; _i < _a.length; _i++) {
        var id = _a[_i];
        dfs(id);
    }
}
//# sourceMappingURL=util.js.map

function feasibleTree(graph) {
    var t = new Graph({ directed: false });
    var start = graph.nodeIds[0];
    var size = graph.nodeIds.length;
    t.setNode(start, {});
    // TODO!
    return t;
}
//# sourceMappingURL=feasible-tree.js.map

function doDfs(graph, id, postorder, visited, navigation, acc) {
    if (visited[id]) {
        return;
    }
    visited[id] = true;
    if (!postorder) {
        acc.push(id);
    }
    for (var _i = 0, _a = navigation(id); _i < _a.length; _i++) {
        var i = _a[_i];
        doDfs(graph, i, postorder, visited, navigation, acc);
    }
    if (postorder) {
        acc.push(id);
    }
}
/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
function dfs(graph, ids, order) {
    if (!Array.isArray(ids)) {
        ids = [];
    }
    var navigation = (graph.directed ? graph.successors : graph.neighbors).bind(graph);
    var acc = [];
    var visited = {};
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        if (!graph.hasNode(id)) {
            throw new Error("Graph does not have node with id " + id);
        }
        doDfs(graph, id, order === 'post', visited, navigation, acc);
    }
    return acc;
}
//# sourceMappingURL=dfs.js.map

function postorder(graph, ids) {
    return dfs(graph, ids, 'post');
}
//# sourceMappingURL=postorder.js.map

/*
 * Returns true if the edge is in the tree.
 */
function isTreeEdge(tree, preId, id) {
    return tree.hasEdge(preId, id);
}
function dfsAssignLowLim(tree, visited, nextLim, id, parent) {
    var low = nextLim;
    var node = tree.node(id);
    visited[id] = true;
    for (var _i = 0, _a = tree.neighbors(id); _i < _a.length; _i++) {
        var i = _a[_i];
        if (!visited[i]) {
            nextLim = dfsAssignLowLim(tree, visited, nextLim, i, id);
        }
    }
    node.low = low;
    node.lim = nextLim++;
    if (parent) {
        node.parent = parent;
    }
    else {
        // TODO should be able to remove this when we incrementally update low lim
        delete node.parent;
    }
    return nextLim;
}
function initLowLimValues(tree, root) {
    if (root === undefined) {
        root = tree.nodeIds[0];
    }
    dfsAssignLowLim(tree, {}, 1, root);
}
/*
 * Given the tight tree, its graph, and a child in the graph calculate and
 * return the cut value for the edge between the child and its parent.
 */
function calcCutValue(tree, graph, child) {
    var childLab = tree.node(child);
    var parent = childLab.parent;
    // True if the child is on the tail end of the edge in the directed graph
    var childIsTail = true;
    // The graph's view of the tree edge we're inspecting
    var graphEdge = graph.edge(child, parent);
    // The accumulated cut value for the edge between this node and its parent
    var cutValue = 0;
    if (!graphEdge) {
        childIsTail = false;
        graphEdge = graph.edge(parent, child);
    }
    cutValue = graphEdge.weight;
    for (var _i = 0, _a = graph.nodeEdgeObjects(child); _i < _a.length; _i++) {
        var edge = _a[_i];
        var isOutEdge = edge.fromId === child;
        var other = isOutEdge ? edge.toId : edge.fromId;
        if (other !== parent) {
            var pointsToHead = isOutEdge === childIsTail;
            var otherWeight = edge.weight;
            cutValue += pointsToHead ? otherWeight : -otherWeight;
            if (isTreeEdge(tree, child, other)) {
                var otherCutValue = tree.edge(child, other).cutvalue;
                cutValue += pointsToHead ? -otherCutValue : otherCutValue;
            }
        }
    }
    return cutValue;
}
function assignCutValue(tree, graph, child) {
    var childLab = tree.node(child);
    var parent = childLab.parent;
    tree.edge(child, parent).cutvalue = calcCutValue(tree, graph, child);
}
/*
 * Initializes cut values for all edges in the tree.
 */
function initCutValues(tree, graph) {
    var ids = postorder(tree, tree.nodeIds);
    ids = ids.slice(0, ids.length - 1);
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        assignCutValue(tree, graph, id);
    }
}
function networkSimplex(graph) {
    // g = simplify(g);
    longestPath(graph);
    var tree = feasibleTree(graph);
    initLowLimValues(tree);
    initCutValues(tree, graph);
    // while ((e = leaveEdge(tree))) {
    //   f = enterEdge(t, g, e);
    //   exchangeEdges(t, g, e, f);
    // }
}
//# sourceMappingURL=network-simplex.js.map

/*
 * Assigns a rank to each node in the input graph that respects the "minlen"
 * constraint specified on edges between nodes.
 *
 * This basic structure is derived from Gansner, et al., "A Technique for
 * Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a connected DAG
 *    2. Graph nodes must be objects
 *    3. Graph edges must have "weight" and "minlen" attributes
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have a "rank" attribute based on the results of the
 *       algorithm. Ranks can start at any index (including negative), we'll
 *       fix them up later.
 */
function rank(graph) {
    var _a;
    switch ((_a = graph.graph) === null || _a === void 0 ? void 0 : _a.ranker) {
        case "network-simplex":
            networkSimplex(graph);
            break;
        // case "tight-tree": tightTreeRanker(g); break;
        // case "longest-path": longestPathRanker(g); break;
        default: networkSimplex(graph);
    }
}
//# sourceMappingURL=rank.js.map

function maxRank(graph) {
    return Math.max.apply(Math, graph.nodeObjects.map(function (n) { var _a; return _a = n.rank, (_a !== null && _a !== void 0 ? _a : 0); }));
}
function buildLayerMatrix(graph) {
    var layering = [];
    for (var i = 0; i < maxRank(graph) + 1; i++) {
        layering.push([]);
    }
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
//# sourceMappingURL=util.js.map

/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
function initOrder(graph) {
    var visited = {};
    var nodesWithoutChildren = graph.nodeObjects.filter(function (node) { return !Object.keys(node.children).length; });
    var maxRank = Math.max.apply(Math, nodesWithoutChildren.map(function (node) { var _a; return _a = node.rank, (_a !== null && _a !== void 0 ? _a : 0); }));
    var layers = [];
    for (var i = 0; i < maxRank + 1; i++) {
        layers.push([]);
    }
    function dfs(node) {
        var _a;
        if (visited[node.id]) {
            return;
        }
        visited[node.id] = true;
        layers[_a = node.rank, (_a !== null && _a !== void 0 ? _a : 0)].push(node.id);
        for (var _i = 0, _b = graph.successors(node.id); _i < _b.length; _i++) {
            var successor = _b[_i];
            dfs(graph.node(successor));
        }
    }
    var orderedNodes = nodesWithoutChildren.sort(function (a, b) { var _a, _b; return (_a = a.rank, (_a !== null && _a !== void 0 ? _a : 0)) - (_b = b.rank, (_b !== null && _b !== void 0 ? _b : 0)); });
    for (var _i = 0, orderedNodes_1 = orderedNodes; _i < orderedNodes_1.length; _i++) {
        var node = orderedNodes_1[_i];
        dfs(node);
    }
    return layers;
}
//# sourceMappingURL=initOrder.js.map

function assignOrder(graph, layering) {
    for (var _i = 0, layering_1 = layering; _i < layering_1.length; _i++) {
        var layer = layering_1[_i];
        for (var order_1 in layer) {
            if (layer.hasOwnProperty(order_1)) {
                graph.node(layer[order_1]).order = Number(order_1);
            }
        }
    }
}
function order(graph) {
    var rank = maxRank(graph);
    var layering = initOrder(graph);
    assignOrder(graph, layering);
}
//# sourceMappingURL=order.js.map

function positionY(graph) {
    var layers = buildLayerMatrix(graph);
    var rankSep = /*graph.graph?.ranksep*/ 0;
    var prevY = 0;
    console.log('vertical layer matrix', layers);
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
    rank(graph);
    order(graph);
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
//# sourceMappingURL=Renderer.js.map

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
                label: el.id,
                rx: 5,
                ry: 5
            };
            if ((_a = el.options) === null || _a === void 0 ? void 0 : _a.label) {
                elData.label = el.options.label;
            }
            g.setNode(el.id, elData);
        }
        for (var _i = 0, _b = this.elements; _i < _b.length; _i++) {
            var el = _b[_i];
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

export default FlowChart;
//# sourceMappingURL=FlowChart.js.map
