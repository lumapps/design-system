export function reactToVue2(Component) {
    return {
        functional: true,
        props: Component.defaultProps || {},
        render(h, context) {
            const {
                props,
                data,
                listeners,
                children, // This is the default slot content
                slots: slotsFn,
                scopedSlots
            } = context;

            const reactProps = {
                ...props.props,               // Standard props
                ...data.attrs.props,          // Attributes not defined as props
                className: data.class,  // Map Vue 'class' -> React 'className'
                style: data.style,      // Pass style through
                children: children,     // Pass children
                ref: data.ref,          // Pass ref
            };

            // 2. Event Listeners (on: { click }) -> React (onClick)
            if (listeners) {
                Object.keys(listeners).forEach(event => {
                    const eventName = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
                    reactProps[eventName] = listeners[event];
                });
            }

            // 3. Named Slots -> Specific Props
            // Example: <template slot="icon">...</template> becomes props.icon
            const slots = slotsFn(); // Execute to get static slots
            Object.keys(slots).forEach(name => {
                if (name !== 'default') {
                    // Vue slots are arrays of VNodes. React usually accepts arrays.
                    reactProps[name] = slots[name];
                }
            });

            // 4. Scoped Slots -> Render Props (Functions)
            // Example: <template slot="item" slot-scope="props">...</template>
            // Becomes: props.item = (props) => VNode
            if (scopedSlots) {
                Object.keys(scopedSlots).forEach(name => {
                    // Scoped slots in Vue are already functions, which matches 
                    // React's "Render Prop" pattern perfectly.
                    reactProps[name] = scopedSlots[name];
                });
            }

            // 5. Execute Component
            return Component.render(h, reactProps);
        }
    };
}