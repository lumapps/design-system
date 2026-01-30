import { ButtonGroup, ButtonGroupProps, Button } from '@lumx/vue';

export default {
    title: 'LumX components/button/ButtonGroup',
    component: ButtonGroup,
    argTypes: { children: { control: false } },
};

/** Size & emphasis variants */
// export const Variants = {
//     render: ({ size, emphasis, theme }: any) => (
//         <ButtonGroup>
//             <Button size={size} emphasis={emphasis} theme={theme}>
//                 Button
//             </Button>
//             <IconButton size={size} emphasis={emphasis} theme={theme} label="IconButton" icon={mdiMenuDown} />
//         </ButtonGroup>
//     ),
//     decorators: [
//         withCombinations({
//             cellStyle: { padding: '10px' },
//             combinations: {
//                 rows: { '': { size: Size.m }, 'size=s': { size: Size.s } },
//                 cols: { key: 'emphasis', options: [undefined, Emphasis.medium, Emphasis.low] },
//             },
//         }),
//     ],
// };

export const OneButton = {
    render: (args: ButtonGroupProps) => ({
        components: { ButtonGroup, Button },
        setup() {
            return { args };
        },
        template: `
            <ButtonGroup v-bind="args">
                <Button>Button</Button>
            </ButtonGroup>
        `,
    }),
};

export const ManyButtons = {
    render: (args: ButtonGroupProps) => ({
        components: { ButtonGroup, Button },
        setup() {
            return { args };
        },
        template: `
            <ButtonGroup v-bind="args">
                <span class="visually-hidden">Ignore me</span>
                <Button emphasis="medium">Button 1</Button>
                <span class="visually-hidden">Ignore me</span>
                <Button emphasis="medium">Button 2</Button>
                <span class="visually-hidden">Ignore me</span>
            </ButtonGroup>
        `,
    }),
};
