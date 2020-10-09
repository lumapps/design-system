function loadScript(url: string, integrity?: string, crossOrigin = 'anonymous') {
    return new Promise((resolve, reject) => {
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        if (integrity) {
            script.integrity = integrity;
        }
        script.crossOrigin = crossOrigin;

        const onLoad = (...args: any) => resolve([script, ...args]);
        script.addEventListener('load', onLoad);
        const onError = (...args: any) => reject([script, ...args]);
        script.addEventListener('error', onError);
        script.src = url;
        head.appendChild(script);
    });
}

async function loadDependencies() {
    await Promise.all([
        loadScript(
            'https://code.jquery.com/jquery-3.4.1.js',
            //'https://code.jquery.com/jquery-3.4.1.min.js',
            //'sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=',
        ),
        loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.8/angular.js',
            //'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.8/angular.min.js',
            //'sha384-TBbVc3SDLcWU5RloNEsoiDVvRK9iYkBNMm1OsAcOIVEASb7zzMWB0aMobj6CzKUw',
        ),
    ]);
    const [reactAngular] = await Promise.all([import('react-angular'), import('@lumx/angularjs')]);

    // @ts-ignore
    window.angular.module('design-system', ['lumx', reactAngular.reactAngularModule(false).name]);
    console.debug('ok');

    return reactAngular.default;
}

let ReactAngular: Promise<any>;
export async function loadAngularjs() {
    if (!ReactAngular) {
        ReactAngular = loadDependencies();
    }
    return ReactAngular;
}
