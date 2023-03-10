const assert = require('chai').assert
const expect = require('chai').expect;
const addContext = require('mochawesome/addContext');

/**
 * Cover page tests
 */
describe('Cover page', function () {

    let page;

    before(async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:8080', {
            waitUntil: "networkidle0"
        });
    });

    after(async function () {
        await page.close();
    });

    it('Enable coverpage', async function () {

        /**
         * Enable metadocx cover page and refresh report
         */
        await page.evaluate(() => {
            Metadocx.reporting.viewer.options.coverPage.enabled = true;
            Metadocx.reporting.viewer.refreshReport();
        });

        await page.screenshot({ path: './test/bootstrap/images/cover-page-enabled.png', fullPage: true });

        addContext(this, '/images/cover-page-enabled.png');

        expect('#reportCoverPage').to.exist;

    });


    it('Disable coverpage', async function () {

        /**
         * Enable metadocx cover page and refresh report
         */
        await page.evaluate(() => {
            Metadocx.reporting.viewer.options.coverPage.enabled = false;
            Metadocx.reporting.viewer.refreshReport();
        });

        await page.screenshot({ path: './test/bootstrap/images/cover-page-disabled.png', fullPage: true });

        addContext(this, '/images/cover-page-disabled.png');

        expect('#reportCoverPage').to.exist;

    });


});