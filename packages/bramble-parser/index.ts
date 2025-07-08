export { Bramble } from "./src/index"

import { Bramble } from "./src/index";

const bramble = new Bramble("./src/fixtures/example.havenfs");

bramble.run();

// bramble.debugChunks();
bramble.debugFS();

const errors = bramble.getErrors();

if (errors.length > 0) {
  console.log("Errors found:", errors.length);
  bramble.logErrors();
} else {
  console.log("No errors found");
}
