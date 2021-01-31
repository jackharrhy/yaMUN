import { connect } from "./database";
import { fetchData } from "./scrape/banner";

(async () => {
  await connect("development", "development", "localhost");
  await fetchData(2020, 1, 1);
})();
