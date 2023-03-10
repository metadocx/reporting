const assert = require('chai').assert
const expect = require('chai').expect;
const addContext = require('mochawesome/addContext');

/**
 * Cover page tests
 */
describe('DateTime Criteria', function () {

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

    it('Filter timesheets for date period', async function () {

        /**
         * Enable metadocx cover page and refresh report
         */
        let numberOfRows = await page.evaluate(() => {
            Metadocx.reporting.viewer.options.coverPage.enabled = false;
            Metadocx.reporting.viewer.getCriteria('TimesheetDate').setIsEnabled(true)
            Metadocx.reporting.viewer.getCriteria('TimesheetDate').setValue({
                startDate: '2022-12-01',
                endDate: '2022-12-31'
            });
            Metadocx.reporting.viewer.refreshReport();

            return $('.report-row-data').length;

        });

        await page.screenshot({ path: './test/bootstrap/images/filter-dates.png', fullPage: true });

        addContext(this, '/images/filter-dates.png');

        expect(numberOfRows).to.be.equal(6);

    });


});