import { mdiAbTesting } from 'lumx-icons/dist';
import InputHelper from './InputHelper.vue';

export default {
  title: 'LumX/InputHelper',
  component: InputHelper,
  argTypes: {
    theme: { control: 'text' },
    // Add other props here as needed
  },
};

const Template = (args) => ({
  components: { InputHelper },
  setup() {
    return { args };
  },
  template: '<InputHelper>Text</InputHelper>',
});

export const Default = Template.bind({});
Default.args = {
  // Provide default props here, e.g.:
  theme: 'light',
  icon: mdiAbTesting,
  // name: 'star', // Example if Icon expects a name prop
};
