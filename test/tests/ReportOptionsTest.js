const assert = require('chai').assert
const expect = require('chai').expect;
const addContext = require('mochawesome/addContext');

/**
 * Cover page tests
 */
describe('Report Options', function () {

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


    it('Display options dialog', async function () {

        await page.click('#metadocxReport_options');
        let isVisible = await page.evaluate(() => {
            return $('#metadocxReport_optionsDialog').is(':visible');
        });

        await page.screenshot({ path: './test/bootstrap/images/display-options-dialog.png', fullPage: true });

        addContext(this, '/images/display-options-dialog.png');

        expect(isVisible).to.be.true;

        // Close dialog
        await page.click('#metadocxReport_optionsDialog .btn-secondary');

    });

    it('Set page orientation portrait', async function () {

        let pageWidth = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.page.orientation = 'portrait';
            Metadocx.reporting.viewer.refreshReport();
            return $('#reportPage').width();
        });

        await page.screenshot({ path: './test/bootstrap/images/set-page-orientation-portrait.png', fullPage: true });
        addContext(this, '/images/set-page-orientation-portrait.png');

        expect(pageWidth).to.be.equal(718);

    });

    it('Set page orientation landscape', async function () {

        let pageWidth = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.page.orientation = 'landscape';
            Metadocx.reporting.viewer.refreshReport();
            return $('#reportPage').width();
        });

        await page.screenshot({ path: './test/bootstrap/images/set-page-orientation-landscape.png', fullPage: true });
        addContext(this, '/images/set-page-orientation-landscape.png');

        expect(pageWidth).to.be.equal(958);

    });

    it('Set paper size letter', async function () {

        let pageWidth = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.page.orientation = 'landscape';
            Metadocx.reporting.viewer.options.page.paperSize = 'Letter';
            Metadocx.reporting.viewer.refreshReport();
            return $('#reportPage').width();
        });

        await page.screenshot({ path: './test/bootstrap/images/set-paper-size-letter.png', fullPage: true });
        addContext(this, '/images/set-paper-size-letter.png');

        expect(pageWidth).to.be.equal(958);


    });

    it('Set paper size legal', async function () {

        let pageWidth = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.page.orientation = 'landscape';
            Metadocx.reporting.viewer.options.page.paperSize = 'Legal';
            Metadocx.reporting.viewer.refreshReport();
            return $('#reportPage').width();
        });

        await page.screenshot({ path: './test/bootstrap/images/set-paper-size-legal.png', fullPage: true });
        addContext(this, '/images/set-paper-size-legal.png');

        expect(pageWidth).to.be.equal(1246);


    });

    it('Set margins', async function () {

        let pageMargins = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.coverPage.enabled = false;
            Metadocx.reporting.viewer.options.page.orientation = 'portrait';
            Metadocx.reporting.viewer.options.page.margins.top = 1;
            Metadocx.reporting.viewer.options.page.margins.bottom = 1;
            Metadocx.reporting.viewer.options.page.margins.left = 1;
            Metadocx.reporting.viewer.options.page.margins.right = 1;
            Metadocx.reporting.viewer.refreshReport();
            return {
                top: $('#reportPage').css('padding-top'),
                bottom: $('#reportPage').css('padding-bottom'),
                left: $('#reportPage').css('padding-left'),
                right: $('#reportPage').css('padding-right')
            }
        });


        await page.screenshot({ path: './test/bootstrap/images/set-margins-1in.png', fullPage: true });
        addContext(this, '/images/set-margins-1in.png');
        addContext(this, {
            title: 'Report Page Margins',
            value: pageMargins
        });

        expect(pageMargins.top).to.be.equal('96px');
        expect(pageMargins.bottom).to.be.equal('96px');
        expect(pageMargins.left).to.be.equal('96px');
        expect(pageMargins.right).to.be.equal('96px');

    });

    it('Change report theme', async function () {

        let backImage = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.coverPage.enabled = true;
            Metadocx.reporting.viewer.options.page.orientation = 'portrait';
            Metadocx.reporting.viewer.options.template = 'Theme1';
            Metadocx.reporting.viewer.refreshReport();
            return $('.report-cover-header').css('background-image');
        });

        await page.waitForTimeout(2000);
        await page.screenshot({ path: './test/bootstrap/images/change-theme.png', fullPage: true });
        addContext(this, '/images/change-theme.png');

        expect(backImage).to.be.equal('url("https://cdn.jsdelivr.net/gh/metadocx/reporting@main/assets/images/templates/Theme1/header.png")');


    });


});