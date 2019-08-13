# Side navigation

**Side navigation regroup navigation items that leads to sections of content for users to navigate.**

## Default

<demo-block component="side-navigation" partial="default" has-theme-switcher="false"></demo-block>

## With icon

Side navigation items can have leading icons.

<demo-block component="side-navigation" partial="with-icon" has-theme-switcher="false"></demo-block>

## States

Side navigation items have two states: _resting_, and _selected_.

<demo-block component="side-navigation" partial="states" has-theme-switcher="false"></demo-block>

## Nested items

Side navigation items can be nested. Parent items have two states: _closed_, and _open_.

<demo-block component="side-navigation" partial="nested" has-theme-switcher="false"></demo-block>

<!--
```javascript jsx
() => (
    <>
        <SideNavigation>
            <SideNavigationItem label="Level 0 (closed)">
                <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} />
            </SideNavigationItem>
            <SideNavigationItem label="Level 0 (open)" isOpen>
                <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} />
                <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} />
            </SideNavigationItem>
        </SideNavigation>
    </>
);
``` -->

## Emphasis

Side navigation items have three emphasises: _low_, _medium_, and _high_. Default is _high_.

<!-- ```javascript jsx
() => (
    <>
        <SideNavigation>
            <SideNavigationItem label="Low" icon={mdiArrowTopRightThick} emphasis={Emphasis.low} />
            <SideNavigationItem label="Medium" icon={mdiArrowTopRightThick} emphasis={Emphasis.medium} />
            <SideNavigationItem label="High" icon={mdiArrowTopRightThick} emphasis={Emphasis.high} />
        </SideNavigation>
    </>
);
``` -->

<demo-block component="side-navigation" partial="emphasis" has-theme-switcher="false"></demo-block>
