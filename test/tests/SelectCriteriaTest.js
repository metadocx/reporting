const assert = require('chai').assert
const expect = require('chai').expect;
const addContext = require('mochawesome/addContext');

/**
 * Cover page tests
 */
describe('Select Criteria', function () {

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

    it('Filter timesheets using employee', async function () {

        /**
         * Enable metadocx cover page and refresh report
         */
        let numberOfRows = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.coverPage.enabled = false;
            Metadocx.reporting.viewer.getCriteria('Employee').setIsEnabled(true);
            Metadocx.reporting.viewer.getCriteria('Employee').setValue(['Amelie Lockington']);
            Metadocx.reporting.viewer.refreshReport();

            Metadocx.reporting.viewer.getCriteria('Employee').setIsEnabled(false);

            return $('.report-row-data').length;

        });

        await page.screenshot({ path: './test/bootstrap/images/filter-select-employee.png', fullPage: true });

        addContext(this, '/images/filter-select-employee.png');

        expect(numberOfRows).to.be.equal(14);

    });

    it('Filter timesheets using activity code', async function () {

        /**
         * Enable metadocx cover page and refresh report
         */
        let numberOfRows = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.coverPage.enabled = false;
            Metadocx.reporting.viewer.getCriteria('ActivityCode').setIsEnabled(true);
            Metadocx.reporting.viewer.getCriteria('ActivityCode').setValue([
                { id: '2', text: '10 - Analysis' },
                { id: '5', text: '80 - Technical Support' }
            ]);
            Metadocx.reporting.viewer.refreshReport();

            Metadocx.reporting.viewer.getCriteria('ActivityCode').setIsEnabled(false);

            return $('.report-row-data').length;

        });

        await page.screenshot({ path: './test/bootstrap/images/filter-select-activitycode.png', fullPage: true });

        addContext(this, '/images/filter-select-activitycode.png');

        expect(numberOfRows).to.be.equal(23);

    });


});