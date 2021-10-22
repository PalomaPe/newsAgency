const { assert } = require("chai");
const v = require("../modules/validation");

describe("TEST ID", () => {
  it("should return T when the value is 36 char long", async () => {
    const result = await v.validateID("thisStringIsThirtySixCharactersLong!");
    assert.isTrue(result);
  });
  it("should return F when the value is 35 char long", async () => {
    const result = await v.validateID("thisStringIsThirtySixCharactersLong");
    assert.isFalse(result);
  });
  it("should return F when the value is 37 char long", async () => {
    const result = await v.validateID("thisStringIsThirtySixCharactersLong!!");
    assert.isFalse(result);
  });
  it("should return F when the value empty", async () => {
    const result = await v.validateID("");
    assert.isFalse(result);
  });
  it("should return F when the value is null", async () => {
    const result = await v.validateID(null);
    assert.isFalse(result);
  });
});

describe("TEST TITLE", () => {
  it("should return T if the title is 255 char long", async () => {
    const str = new Array(256).join("-");
    const result = await v.validateTitle(str);
    assert.isTrue(result);
  });
  it("should return T if the title is less than 255 char long", async () => {
    const str = new Array(255).join("-");
    const result = await v.validateTitle(str);
    assert.isTrue(result);
  });
  it("should return F if the title is more than 255 char long", async () => {
    const str = new Array(257).join("-");
    const result = await v.validateTitle(str);
    assert.isFalse(result);
  });
  it("should return F if the title is empty", async () => {
    const result = await v.validateTitle("");
    assert.isFalse(result);
  });
  it("should return F if the title is null", async () => {
    const result = await v.validateTitle(null);
    assert.isFalse(result);
  });
});

describe("TEST AUTHOR", () => {
  it("should return T if the string is 100 char long", async () => {
    const str = new Array(101).join("-");
    const result = await v.validateAuthor(str);
    assert.isTrue(result);
  });
  it("should return T if the string is less than 100 char long", async () => {
    const str = new Array(100).join("-");
    const result = await v.validateAuthor(str);
    assert.isTrue(result);
  });
  it("should return F if the string is more than 100 char long", async () => {
    const str = new Array(102).join("-");
    const result = await v.validateAuthor(str);
    assert.isFalse(result);
  });
  it("should return F if the string is empty", async () => {
    const result = await v.validateAuthor("");
    assert.isFalse(result);
  });
  it("should return F if the string is null", async () => {
    const result = await v.validateAuthor(null);
    assert.isFalse(result);
  });
});

describe("TEST MODIFIEDAT", () => {
  it("should return F if the modified date is in present", async () => {
    let currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();
    if (currentMonth < 10) currentMonth = `0${currentMonth}`;
    if (currentDay < 10) currentDay = `0${currentDay}`;
    currentDate = `${currentMonth.toString()}/${currentDay.toString()}/${currentYear.toString()}`;
    const result = await v.validateModificationDate(currentDate);
    assert.isFalse(result);
  });
  it("should return T if the modified date is in past", async () => {
    const result = await v.validateModificationDate("07/29/2021");
    assert.isTrue(result);
  });
  it("should return F if the modified date is in the future", async () => {
    const currentDate = new Date();
    const futureYear = currentDate.getFullYear() + 1;
    const futureDate = `01/01/${futureYear}`;
    const result = await v.validateModificationDate(futureDate);
    assert.isFalse(result);
  });
  it("should return F if the modified date is has wrong format", async () => {
    const currentDate = "15/03/2020";
    const result = await v.validateModificationDate(currentDate);
    assert.isFalse(result);
  });
  it("should return F if the modified date is empty", async () => {
    const result = await v.validateModificationDate("");
    assert.isFalse(result);
  });
  it("should return F if the modified date is null", async () => {
    const result = await v.validateModificationDate(null);
    assert.isFalse(result);
  });
});

describe("TEST PUBLISHEDAT", () => {
  it("should return T if the published date is in past", async () => {
    const result = await v.validatePublicationDate("07/29/2021");
    assert.isTrue(result);
  });
  it("should return F if the published date is in present", async () => {
    let currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();
    if (currentMonth < 10) currentMonth = `0${currentMonth}`;
    if (currentDay < 10) currentDay = `0${currentDay}`;
    currentDate = `${currentMonth.toString()}/${currentDay.toString()}/${currentYear.toString()}`;
    const result = await v.validatePublicationDate(currentDate);
    assert.isFalse(result);
  });
  it("should return F if the published date is in the future", async () => {
    const currentDate = new Date();
    const futureYear = currentDate.getFullYear() + 1;
    const futureDate = `01/01/${futureYear}`;
    const result = await v.validatePublicationDate(futureDate);
    assert.isFalse(result);
  });
  it("should return F if the published date is has wrong format", async () => {
    const currentDate = "15/03/2020";
    const result = await v.validatePublicationDate(currentDate);
    assert.isFalse(result);
  });
  it("should return F if the published date is empty", async () => {
    const result = await v.validatePublicationDate("");
    assert.isTrue(result);
  });
  it("should return F if the published date is null", async () => {
    const result = await v.validatePublicationDate(null);
    assert.isTrue(result);
  });
});

describe("TEST URL", () => {
  it("should return T when the URL is valid and the article is published", async () => {
    const url =
      "https://dev.to/itnext/joi-awesome-code-validation-for-node-js-and-express-35pk";
    const result = await v.validateURL(url, "02/04/2020");
    assert.isTrue(result);
  });
  it("should return T when the URL is empty but the article is not published", async () => {
    const url = "";
    const result = await v.validateURL(url, "");
    assert.isTrue(result);
  });
  it("should return F when the URL is null but the article is not published", async () => {
    const url = null;
    const result = await v.validateURL(url, "");
    assert.isTrue(result);
  });
  it("should return F when the URL is empty but the article is pulished", async () => {
    const url = "";
    const result = await v.validateURL(url, "02/04/2020");
    assert.isFalse(result);
  });
  it("should return F when the URL is null but the article is published", async () => {
    const url = null;
    const result = await v.validateURL(url, "02/04/2020");
    assert.isFalse(result);
  });
});

describe("TEST KEYWORDS", () => {
  it("should return T when the are three keywords", async () => {
    const keywords = ["first", "second", "third"];
    const result = await v.validateKeywords(keywords);
    assert.isTrue(result);
  });
  it("should return F when there is only one keyword", async () => {
    const keywords = ["first"];
    const result = await v.validateKeywords(keywords);
    assert.isTrue(result);
  });
  it("should return F when the are more than three keywords", async () => {
    const keywords = ["first", "second", "third", "forth"];
    const result = await v.validateKeywords(keywords);
    assert.isFalse(result);
  });
  it("should return F when there is no keyword", async () => {
    const keywords = [];
    const result = await v.validateKeywords(keywords, "02/04/2020");
    assert.isFalse(result);
  });
  it("should return F when keywords values are not strings", async () => {
    const keywords = [1, {}, []];
    const result = await v.validateKeywords(keywords, "02/04/2020");
    assert.isFalse(result);
  });
});

describe("TEST READMINS", () => {
  it("should return T when readMins qtty is 1", async () => {
    const result = await v.validateReadMins(1);
    assert.isTrue(result);
  });
  it("should return T when readMins qtty is 20", async () => {
    const result = await v.validateReadMins(20);
    assert.isTrue(result);
  });
  it("should return T when readMins qtty is shorter than 1", async () => {
    const result = await v.validateReadMins(0);
    assert.isFalse(result);
  });
  it("should return F when readMins qtty is larger than 20", async () => {
    const result = await v.validateReadMins(21);
    assert.isFalse(result);
  });
  it("should return T when readMins qtty is not positive", async () => {
    const result = await v.validateReadMins(-1);
    assert.isFalse(result);
  });
});
