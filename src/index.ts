import { connect } from "./database";
import { tempInvoke } from "./scrape/banner";

(async () => {
  await connect("development", "development", "localhost");
  try {
    await tempInvoke();
  } catch (err) {
    console.error(err);
  }
})();
