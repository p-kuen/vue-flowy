import Graph from "@/Graph";
export default function postorder<T extends string>(graph: Graph<T>, ids: T[]): T[];
