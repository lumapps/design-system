const { setWorldConstructor } = require('cucumber');
const puppeteer = require('puppeteer');

const BASE_PATH = 'http://localhost:9000/iframe.html?id=';

class LumAppsWorld {
    async openPage(url) {
        this.browser = await puppeteer.launch({
            headless: false,
            sloMo: 100000,
            defaultViewport: { width: 1280, height: 768 },
        });

        this.page = await this.browser.newPage();

        await this.page.goto(`${BASE_PATH}${url}`);
    }

    async closePage() {
        await this.browser.close();
    }
}

setWorldConstructor(LumAppsWorld);
