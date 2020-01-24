import Graph from '../Graph';
export default function dfs<T extends string>(graph: Graph<T>, ids: T[] | T, order: 'pre' | 'post'): any[];
