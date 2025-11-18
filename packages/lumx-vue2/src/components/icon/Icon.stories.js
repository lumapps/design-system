import { mdiAbTesting } from 'lumx-icons/dist';
import Icon from './Icon.vue';

export default {
  title: 'LumX/Icon',
  component: Icon,
  argTypes: {
    theme: { control: 'text' },
    // Add other props here as needed
  },
};

const Template = (args) => ({
  components: { Icon },
  setup() {
    return { args };
  },
  template: '<Icon v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  // Provide default props here, e.g.:
  theme: 'light',
  icon: mdiAbTesting,
  // name: 'star', // Example if Icon expects a name prop
};
