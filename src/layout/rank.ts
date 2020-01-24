import Graph from "@/Graph";
import networkSimplex from "./rank/network-simplex";

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
export function rank<T extends string>(graph: Graph<T>) {
  switch(graph.graph?.ranker) {
    case "network-simplex": networkSimplex(graph); break;
    // case "tight-tree": tightTreeRanker(g); break;
    // case "longest-path": longestPathRanker(g); break;
    default: networkSimplex(graph);
  }
}