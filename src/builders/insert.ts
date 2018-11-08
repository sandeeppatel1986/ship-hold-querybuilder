import {compositeNode, identityNode, Buildable, valueNode} from '../lib/nodes';
import {fluentMethod} from '../lib/util';
import {clauseMixin, FieldClause, IntoClause, nodeSymbol, ReturningClause} from './clause';

type WithIntoFieldReturningClause = IntoClause & FieldClause & ReturningClause;

export interface InsertBuilder extends WithIntoFieldReturningClause, Buildable {
    value: <T>(prop: string, value: T) => InsertBuilder;
}

const proto = Object.assign({
    value: fluentMethod(function (prop, value) {
        this.field(prop);
        this[nodeSymbol].values.add(value === undefined ? identityNode('DEFAULT') : valueNode(value));
    }),
    build(params = {}) {
        const queryNode = compositeNode();
        const {into, field, values, returning} = this[nodeSymbol];
        queryNode.add('INSERT INTO', into, '(', field, ')', 'VALUES', '(', values, ')');
        if (returning.length > 0) {
            queryNode.add('RETURNING', returning);
        }
        return queryNode.build(params);
    }
}, clauseMixin<WithIntoFieldReturningClause>('into', 'field', 'returning'));

export const insert = (map = {}): InsertBuilder => {
    const instance = Object.create(proto, {
        [nodeSymbol]: {
            value: {
                into: compositeNode({separator: ', '}),
                field: compositeNode({separator: ', '}),
                returning: compositeNode({separator: ', '}),
                values: compositeNode({separator: ', '})
            }
        }
    });

    for (const [key, value] of Object.entries(map)) {
        instance.value(key, value);
    }

    return instance;
};
