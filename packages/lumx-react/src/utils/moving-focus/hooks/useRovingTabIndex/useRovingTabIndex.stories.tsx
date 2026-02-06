import React from 'react';

import shuffle from 'lodash/shuffle';

import { Button, ButtonProps, FlexBox } from '@lumx/react';
import { StoryFn } from '@storybook/react-vite';

import { MovingFocusProvider } from '../../components/MovingFocusProvider';
import { INITIAL_STATE } from '../../ducks/slice';
import { useRovingTabIndex } from './useRovingTabIndex';

const loopAroundOptions = ['inside', 'next-loop', 'next-end'];

export default {
    title: 'utils/moving-focus/hooks/useRovingTabIndex',
    argTypes: {
        direction: { control: 'inline-radio', options: ['horizontal', 'vertical', 'both'] },
        loopAroundRow: { control: 'inline-radio', options: loopAroundOptions },
        loopAroundColumn: { control: 'inline-radio', options: loopAroundOptions },
    },
    args: {
        direction: INITIAL_STATE.direction,
        loopAroundRow: INITIAL_STATE.loopAround.row,
        loopAroundColumn: INITIAL_STATE.loopAround.col,
        gridJumpToShortcutDirection: INITIAL_STATE.gridJumpToShortcutDirection,
    },
};

// Button using the `useRovingTabIndex()` hook.
export const RovingTabIndexButton: React.FC<ButtonProps & { autofocus?: boolean }> = ({
    disabled,
    index,
    rowKey,
    role,
    children,
    onClick,
    autofocus,
}) => {
    const ref = React.useRef<HTMLButtonElement>(null);
    const [tabIndex, focused, onKeyDown, handleClick] = useRovingTabIndex(ref, disabled, rowKey, autofocus);
    React.useEffect(() => {
        if (focused) {
            ref.current?.focus();
        }
    }, [focused]);

    const suffix = rowKey === undefined ? index : `${rowKey}-${index}`;
    const defaultChildren = `Button ${suffix}`;
    return (
        <Button
            tabIndex={tabIndex}
            ref={ref}
            disabled={disabled}
            onKeyDown={onKeyDown}
            onClick={(event) => {
                if (onClick) {
                    onClick(event);
                }
                handleClick();
            }}
            role={role}
        >
            {children || defaultChildren}
        </Button>
    );
};

/**
 * Example list roving tabindex (implements role=toolbar keyboard navigation)
 */
export const List: StoryFn<any> = ({
    listOrientation,
    direction,
    loopAround,
    loopAroundRow,
    loopAroundColumn,
    gridJumpToShortcutDirection,
    autofocusIndex,
    disabledIndex = 2,
}) => (
    <>
        <Button emphasis="low">Focus before</Button>
        <MovingFocusProvider
            options={{
                direction,
                loopAround: loopAround !== undefined ? loopAround : { row: loopAroundRow, col: loopAroundColumn },
                gridJumpToShortcutDirection,
            }}
        >
            <FlexBox role="toolbar" orientation={listOrientation || 'horizontal'} gap="regular">
                {Array.from({ length: 4 }).map((_, index) => (
                    <RovingTabIndexButton
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        index={index + 1}
                        disabled={disabledIndex === index}
                        autofocus={autofocusIndex === index}
                    />
                ))}
            </FlexBox>
        </MovingFocusProvider>
        <Button emphasis="low">Focus after</Button>
    </>
);
List.argTypes = {
    listOrientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
};

/**
 * Example grid roving tabindex (implements role=grid keyboard navigation)
 */
export const Grid: StoryFn<any> = ({ loopAround, complete, gridJumpToShortcutDirection }: any) => (
    <>
        <Button emphasis="low">Focus before</Button>
        <MovingFocusProvider options={{ loopAround, gridJumpToShortcutDirection }}>
            <FlexBox role="grid" orientation="vertical" gap="regular">
                <FlexBox role="row" orientation="horizontal" gap="regular">
                    <RovingTabIndexButton role="gridcell" index={0} rowKey={0} />
                    <RovingTabIndexButton role="gridcell" index={1} rowKey={0} />
                    <RovingTabIndexButton role="gridcell" index={2} rowKey={0} />
                </FlexBox>
                <FlexBox role="row" orientation="horizontal" gap="regular">
                    <RovingTabIndexButton role="gridcell" index={0} rowKey={1} />
                    <RovingTabIndexButton role="gridcell" index={1} rowKey={1} />
                    <RovingTabIndexButton role="gridcell" index={2} rowKey={1} />
                </FlexBox>
                <FlexBox role="row" orientation="horizontal" gap="regular">
                    <RovingTabIndexButton role="gridcell" index={0} rowKey={2} />
                    <RovingTabIndexButton role="gridcell" index={1} rowKey={2} />
                    {complete && <RovingTabIndexButton role="gridcell" index={2} rowKey={2} />}
                </FlexBox>
            </FlexBox>
        </MovingFocusProvider>
        <Button emphasis="low">Focus after</Button>
    </>
);
Grid.argTypes = {
    loopAround: { control: 'boolean' },
    loopAroundRow: { control: false },
    loopAroundColumn: { control: false },
};
Grid.args = {
    loopAround: false,
    gridJumpToShortcutDirection: 'horizontal',
};

export const GridLoopAround: any = Grid.bind({});
GridLoopAround.argTypes = Grid.argTypes;
GridLoopAround.args = {
    loopAround: true,
};

const GridObjectConfigurationTemplate: any = ({ loopAroundRow, loopAroundColumn }: any) => {
    return <Grid loopAround={{ row: loopAroundRow, col: loopAroundColumn }} />;
};

export const GridLoopInside = GridObjectConfigurationTemplate.bind({});
GridLoopInside.args = {
    loopAroundRow: 'inside',
    loopAroundColumn: 'inside',
};

export const GridLoopInsideRow = GridObjectConfigurationTemplate.bind({});
GridLoopInsideRow.args = {
    loopAroundRow: 'inside',
};

export const GridLoopInsideColumns: any = GridObjectConfigurationTemplate.bind({});
GridLoopInsideColumns.args = {
    loopAroundColumn: 'inside',
};

export const GridLoopOnlyColumns: any = GridObjectConfigurationTemplate.bind({});
GridLoopOnlyColumns.args = {
    loopAroundRow: 'next-end',
    loopAroundColumn: 'next-loop',
};

export const GridLoopOnlyRows: any = GridObjectConfigurationTemplate.bind({});
GridLoopOnlyRows.args = {
    loopAroundRow: 'next-loop',
    loopAroundColumn: 'next-end',
};

const defaultRows = Array.from({ length: 10 }).map((_v, index) => index);
export const GridWithUpdatableTabStops: StoryFn<React.FC<{ baseRows: Array<string | number> }>> = ({
    baseRows = defaultRows,
}) => {
    const [stops, setStops] = React.useState<Array<string | number>>(baseRows);
    const [listKey, setListKey] = React.useState<string | undefined>();

    const handleDelete = (value: string | number) => {
        setStops((currentStops) => currentStops.filter((stopValue) => stopValue !== value));
    };

    const handleRestore = () => {
        setStops(baseRows);
    };

    const id = React.useId();

    return (
        <>
            <Button emphasis="low" onClick={handleRestore}>
                Restore rows
            </Button>
            <Button
                emphasis="low"
                onClick={() => {
                    setListKey(id);
                    setStops((currentStops) => shuffle(currentStops));
                }}
            >
                Shuffle rows
            </Button>
            <MovingFocusProvider
                options={{
                    direction: 'both',
                    loopAround: true,
                    listKey,
                }}
            >
                <FlexBox role="toolbar" orientation="vertical" gap="regular">
                    {stops.map((value) => {
                        return (
                            <FlexBox key={value} orientation="horizontal" gap="regular" role="row">
                                <RovingTabIndexButton index={value} rowKey={value} role="gridcell" />
                                <RovingTabIndexButton
                                    role="gridcell"
                                    onClick={() => handleDelete(value)}
                                    rowKey={value}
                                >
                                    Delete
                                </RovingTabIndexButton>
                            </FlexBox>
                        );
                    })}
                </FlexBox>
            </MovingFocusProvider>
        </>
    );
};
