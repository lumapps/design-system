import isChromatic from 'chromatic/isChromatic';

/** Story decorator used to force a minimum screen size when running in chromatic */
export const withChromaticForceScreenSize = () => {
    return (story: any) => {
        if (!isChromatic()) return story();

        return {
            setup() {
                return { style: { minWidth: '1200px', minHeight: '800px' } };
            },
            template: `
                <div :style="style">
                    <story />
                </div>
            `,
        };
    };
};
