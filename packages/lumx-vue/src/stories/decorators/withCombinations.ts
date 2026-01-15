/* eslint-disable jsx-a11y/control-has-associated-label,prefer-object-spread */
import { defineComponent, h, markRaw } from 'vue';
import isEmpty from 'lodash/isEmpty';

type PropEntry = [key: string, value: unknown];
type PropCombination = Record<string, Record<string, unknown>>;
type PropArrayCombination = { key: string; options: Array<any> };
type Combination = PropArrayCombination | PropCombination;

const toProps = <E>(arr: Array<E>, prop: string): PropEntry[] => arr.map((value) => [String(value), { [prop]: value }]);

const isArrayConfig = (c?: Combination): c is PropArrayCombination => !!c?.key;

function toPropEntries(config?: Combination): PropEntry[] {
    if (isEmpty(config)) return [['', {}]];
    if (isArrayConfig(config)) return toProps(config.options, config.key);
    return Object.entries(config as PropCombination);
}

const StoryInstance = defineComponent({
    props: ['story', 'args'],
    render() {
        // This creates the VNode for the specific story variation
        return h(this.story({ args: this.args }));
    },
});

const CombinationTable = defineComponent({
    name: 'CombinationTable',
    components: { StoryInstance },
    props: ['Story', 'ctx', 'options'],
    setup(props) {
        const { combinations, combinator = Object.assign, excludeCombination } = props.options;

        const rows = toPropEntries(combinations.rows);
        const cols = toPropEntries(combinations.cols);
        const sections = toPropEntries(combinations.sections);

        const getMergedArgs = (sValue: any, rValue: any = {}, cValue: any = {}) => {
            // We merge the global ctx.args (Storybook controls) with the specific matrix values
            return combinator(combinator(combinator({ ...props.ctx.args }, sValue), rValue), cValue);
        };

        return {
            rows,
            cols,
            sections,
            getMergedArgs,
            excludeCombination,
            hasRows: rows.length > 1,
            hasCols: cols.length > 1,
            // Keep the Story function raw so it doesn't get proxied
            rawStory: markRaw(props.Story),
        };
    },
    template: `
        <div class="sb-combination-container">
            <template v-for="[sKey, sValue] in sections" :key="sKey">
                <section :style="options.sectionStyle" style="margin-bottom: 2rem;">
                    <h3 v-if="sKey" style="text-transform: capitalize;">{{ sKey }}</h3>

                    <table v-if="hasRows || hasCols" 
                           :style="{ ...options.tableStyle, borderCollapse: 'separate', borderSpacing: '8px' }">
                        <thead v-if="options.combinations.cols">
                            <tr>
                                <th v-if="hasRows" aria-hidden="true"></th>
                                <template v-for="[cKey, cValue] in cols" :key="cKey">
                                    <th v-if="!excludeCombination?.(getMergedArgs(sValue, {}, cValue))" :style="options.colStyle">
                                        <small>{{ cKey }}</small>
                                    </th>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="([rKey, rValue], i) in rows" :key="i">
                                <template v-if="!excludeCombination?.(getMergedArgs(sValue, rValue))">
                                    <th v-if="hasRows" :style="{ ...options.firstColStyle, textAlign: 'left' }">
                                        <small>{{ rKey }}</small>
                                    </th>
                                    <td v-for="[cKey, cValue] in cols" 
                                        :key="cKey" 
                                        :style="{ textAlign: options.combinations.cols ? 'center' : undefined, ...options.cellStyle }">
                                        
                                        <template v-if="!excludeCombination?.(getMergedArgs(sValue, rValue, cValue))">
                                            <StoryInstance 
                                                :story="rawStory" 
                                                :args="getMergedArgs(sValue, rValue, cValue)" 
                                            />
                                        </template>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </table>

                    <StoryInstance 
                        v-else 
                        :story="rawStory" 
                        :args="getMergedArgs(sValue)" 
                    />
                </section>
            </template>
        </div>
    `,
});

export const withCombinations = (options: any) => (Story: any, ctx: any) => {
    return {
        components: { CombinationTable },
        setup() {
            return { Story, ctx, options };
        },
        template: `<CombinationTable :Story="Story" :ctx="ctx" :options="options" />`,
    };
};
