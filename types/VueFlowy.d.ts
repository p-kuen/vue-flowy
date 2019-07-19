import { Vue } from 'vue-property-decorator';
import { FlowChart } from './FlowChart';
import { FlowElement } from './FlowElement';
import { CreateElement } from 'vue';
export * from './FlowChart';
export declare class VueFlowy extends Vue {
    chart: FlowChart;
    private chartElement;
    render(h: CreateElement): import("vue").VNode;
    onElementsChanged(val: FlowElement[], oldVal: FlowElement[]): void;
    mounted(): void;
}
