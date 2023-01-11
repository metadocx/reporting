const assert = require('chai').assert
const expect = require('chai').expect;
const addContext = require('mochawesome/addContext');

/**
 * Report viewer tests
 */
describe('Report Viewer', function () {
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

  it('Metadocx instance should exist', async function () {

    let metadocxClassName = await page.evaluate(() => {
      return Metadocx.constructor.name;
    });

    addContext(this, {
      title: 'Metadocx class name',
      value: metadocxClassName
    });

    expect(metadocxClassName).to.be.equal('MetadocxApplication');

  })


});