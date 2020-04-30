const { When } = require('cucumber');

When('the user clicks on the element {string}', async function clickOnElement(selector) {
    await this.page.waitForSelector(selector);

    this.page.click(selector);
});

When('the user enters the text {string} on the input {string}', async function setText(text, selector) {
    await this.page.focus(selector);
    await this.page.keyboard.type(text);
});
