import { Bramble } from "./src/index";
export { Bramble } from "./src/index"


//* CLI Entrypoint guard
if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2] ?? "./src/fixtures/example.havenfs";
  const bramble = new Bramble(file);

  bramble.run();
  bramble.debugFS();

  const errors = bramble.getErrors();
  if (errors.length > 0) {
    console.log("Errors found:", errors.length);
    bramble.logErrors();
  } else {
    console.log("No errors found");
  }
}
