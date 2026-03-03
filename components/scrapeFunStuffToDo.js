import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const URL = "https://hellbenthitchings.com/vendors";

async function scrapeFunStuffToDo() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const funStuff = [];

    // Find the exact h2
    const funHeader = $("h2").filter((i, el) =>
      $(el).text().toLowerCase().includes("fun stuff to do")
    );

    if (!funHeader.length) {
      console.log("❌ Could not find Fun Stuff header");
      return;
    }

    // Grab EVERYTHING after that header
    const sectionContent = funHeader.nextAll();

    sectionContent.each((i, el) => {
      // Stop if we hit another major section (like another h2)
      if (el.tagName === "h2") return false;

      $(el).find("a").each((i, link) => {
        const name = $(link).text().trim();
        const url = $(link).attr("href");

        if (name && url && url.startsWith("http")) {
          funStuff.push({ name, website: url });
        }
      });
    });

    // Remove duplicates
    const uniqueStuff = Array.from(
      new Map(funStuff.map(v => [v.website, v])).values()
    );

    fs.writeFileSync(
      "funStuff.json",
      JSON.stringify(uniqueStuff, null, 2)
    );

    console.log(`✅ Scraped ${uniqueStuff.length} Fun Stuff items`);
  } catch (err) {
    console.error("Error scraping:", err);
  }
}

scrapeFunStuffToDo();