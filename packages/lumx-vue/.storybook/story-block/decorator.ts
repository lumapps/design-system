import StoryBlock from './StoryBlock.vue';

export const withStoryBlockDecorator = (story: any, context: any) => ({
  components: { StoryBlock },
  setup() {
    return { context };
  },
  template: `
    <StoryBlock :context="context">
      <story />
    </StoryBlock>
  `
});
