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
var Graph = /** @class */ (function () {
    function Graph(options) {
        var _a, _b;
        this.compound = false;
        this.nodes = {};
        this.edges = {};
        this.compound = (_b = (_a = options) === null || _a === void 0 ? void 0 : _a.compound, (_b !== null && _b !== void 0 ? _b : false));
    }
    Graph.prototype.setGraph = function (graph) {
        this.graph = graph;
        return this;
    };
    Graph.prototype.setNode = function (id, options) {
        var defaultOptions = {
            width: 10,
            height: 10,
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            parent: null,
            children: {},
            labelType: 'text'
        };
        this.nodes[id] = Object.assign(defaultOptions, options);
        return this;
    };
    Graph.prototype.node = function (id) {
        return this.nodes[id];
    };
    Object.defineProperty(Graph.prototype, "nodeIds", {
        get: function () {
            return Object.keys(this.nodes);
        },
        enumerable: true,
        configurable: true
    });
    Graph.prototype.setEdge = function (fromId, toId, options) {
        var id = this.createEdgeId(fromId, toId);
        this.edges[id] = options;
    };
    Graph.prototype.edge = function (id) {
        return this.edges[id];
    };
    Object.defineProperty(Graph.prototype, "edgeIds", {
        get: function () {
            return Object.keys(this.edges);
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
}

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
        createNodes(element.append('g').attr('class', 'nodes'), graph);
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
