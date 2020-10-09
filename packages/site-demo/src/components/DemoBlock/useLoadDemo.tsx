import { loadAngularjs } from '@lumx/demo/components/DemoBlock/loadAngularjs';
import { Engine } from '@lumx/demo/context/engine';
import { Theme } from '@lumx/react';
import React, { useEffect, useState } from 'react';

interface Module {}
type NullModule = Module;
interface HasTheme {
    theme: Theme;
}

export type DemoModule = Module & {
    default: React.FC<HasTheme>;
};
type AngularControllerModule = Module & {
    DemoController(): void;
};
export type Code =
    | undefined
    | {
          react?: {
              demo?: DemoModule | NullModule;
              code?: string;
          };
          angularjs?: {
              demo?: {
                  controller?: AngularControllerModule | NullModule;
                  template?: string | NullModule;
              };
              code?: string;
          };
      };

function loadReactDemo(code: Code): DemoModule | null {
    const demo = code?.react?.demo;
    if (!demo || !('default' in demo)) {
        return null;
    }
    return demo;
}

async function loadAngularjsDemo(code: Code): Promise<DemoModule | null> {
    const controllerModule = code?.angularjs?.demo?.controller;
    const template = code?.angularjs?.demo?.template;
    if (!template || !(typeof template === 'string') || !controllerModule || !('DemoController' in controllerModule)) {
        return null;
    }
    const AngularTemplate = await loadAngularjs();

    // @ts-ignore
    window.angular.module('design-system').controller('DemoController', controllerModule.DemoController);
    return {
        default({ theme }: HasTheme) {
            let container: any;

            useEffect(() => {
                if (!container) {
                    return;
                }

                container.$scope.theme = theme;
                container.$scope.$apply();
            }, [container, theme]);

            return (
                <AngularTemplate
                    ref={(c: any) => (container = c)}
                    template={template}
                    controller={controllerModule.DemoController}
                    controllerAs="vm"
                    scope={{ theme }}
                />
            );
        },
    };
}

export const useLoadDemo = (code: Code, engine: string): DemoModule | null => {
    const [demo, setDemo] = useState<DemoModule | null>(null);

    useEffect(() => {
        if (engine === Engine.angularjs) {
            loadAngularjsDemo(code).then(setDemo);
        } else {
            setDemo(loadReactDemo(code));
        }
    }, [engine]);

    return demo;
};
