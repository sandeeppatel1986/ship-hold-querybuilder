import { ConditionsBuilder, SQLComparisonOperator } from '../builders/conditions';
import { Buildable, CompositeNode, NodeParam } from './nodes';
declare const _default: <T extends Buildable>(mainBuilder: T, nodes: CompositeNode) => (leftOperand: NodeParam<any>, operator?: SQLComparisonOperator, rightOperand?: NodeParam<any>) => ConditionsBuilder<T> & T;
export default _default;
