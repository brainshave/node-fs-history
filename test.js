var fs = require("fs");

var assert = require("assert");
var history = require("./index");

var drain1 = history();

run().catch((error) => {
  console.error(error.stack);
  process.exit(1);
});

async function run() {
  // Every new drain should be empty
  assert.deepEqual(drain1(), []);

  fs.readFileSync("package.json");

  // Start the second drain which should be independent from drain1
  var drain2 = history();
  assert.deepEqual(drain2(), []);

  fs.readFileSync("README.md");

  // This should trigger `open` instead of `openSync`
  await new Promise((resolve) => fs.readFile("index.js", () => resolve()));

  // drain1 should have all files we read
  assert.deepEqual(drain1(), ["package.json", "README.md", "index.js"]);

  // drain2 should have only two latter files
  assert.deepEqual(drain2(), ["README.md", "index.js"]);

  // After the drainage they should be empty:
  assert.deepEqual(drain1(), []);
  assert.deepEqual(drain2(), []);

  console.log("Done.");
}
