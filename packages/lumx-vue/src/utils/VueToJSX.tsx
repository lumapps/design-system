export const VueToJSX = (Component) => {
    return (props, { slots }) => {
        return Component({
            ...props,
            children: slots.default(),
        })
    };
}