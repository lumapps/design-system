import { flattenChildren } from '@lumx/react/utils/flattenChildren';
import { mount } from 'enzyme';
import React from 'react';

const Comp = ({ children }: any) => children;

describe('flattenChildren', () => {
    it('should flatten children in arrays or fragments', () => {
        const nodes = (
            <Comp>
                {flattenChildren(
                    <>
                        <Comp>foo</Comp>
                        {[
                            <Comp key="1">bar</Comp>,
                            <Comp key="2">{['baz', <Comp key="1">qux</Comp>]}</Comp>,
                            ['quux', <Comp key="2">quuz</Comp>],
                        ]}
                        corge
                        <>grault</>
                    </>,
                )}
            </Comp>
        );
        expect(mount(nodes)).toMatchInlineSnapshot(`
            <Comp>
              <Comp
                key=".0..0"
              >
                foo
              </Comp>
              <Comp
                key=".0..1:$1"
              >
                bar
              </Comp>
              <Comp
                key=".0..1:$2"
              >
                baz
                <Comp
                  key="1"
                >
                  qux
                </Comp>
              </Comp>
              quux
              <Comp
                key=".0..1:2:$2"
              >
                quuz
              </Comp>
              corge
              grault
            </Comp>
        `);
    });
});
