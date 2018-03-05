import test from 'zora';
import {compositeNode} from '../src/lib/nodes';
import {nodeSymbol, clauseMixin} from '../src/builders/clause';

test('where builder: create a chainable delegation', t => {
	const foo = compositeNode();
	const bar = compositeNode();
	const builder = Object.assign(clauseMixin('foo', 'bar'), {
		[nodeSymbol]: {
			foo,
			bar
		}
	});

	const newBar = compositeNode();

	builder.foo('f1', 'f2');
	const fooContent = [...builder.node('foo')];

	t.deepEqual(fooContent, [{value: 'f1'}, {value: 'f2'}], 'should have forwarded the args');
	t.equal(builder.node('foo'), foo);
	t.equal(builder.node('bar'), bar);

	builder.node('bar', newBar);
	t.equal(builder.node('bar'), newBar, 'should have swapped nodes');
});