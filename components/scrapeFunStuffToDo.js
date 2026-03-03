import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const URL = "https://hellbenthitchings.com/vendors";

async function scrapeFunStuffToDo() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const funStuff = [];

    // Loop through all links on the page
    $("a").each((i, el) => {
      const name = $(el).text().trim();
      const url = $(el).attr("href");

      // Filter: only keep real external vendor links
      if (
        name &&
        url &&
        url.startsWith("http") &&
        !url.includes("hellbenthitchings.com")
      ) {
        funStuff.push({
          name,
          website: url,
        });
      }
    });

    // Remove duplicates
    const uniqueStuff = Array.from(
      new Map(funStuff.map(v => [v.website, v])).values()
    );

    // Save to JSON file
    fs.writeFileSync(
      "funStuff.json",
      JSON.stringify(uniqueStuff, null, 2)
    );

    console.log(`✅ Scraped ${uniqueStuff.length} fun things to do`);
  } catch (err) {
    console.error("Error scraping:", err);
  }
}

scrapeFunStuffToDo();