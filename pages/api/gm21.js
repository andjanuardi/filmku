import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  res.setHeader("Content-type", "application/json");
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const url = "https://gudangmovies21.boats";
  let api_url = url;
  if (req.query.d === "movie") {
    if (typeof req.query.s !== "undefined") {
      api_url = `${url}/page/${req.query.p}/?s=${req.query.s}`;
    } else {
      api_url = `${url}/page/${req.query.p}`;
      if (typeof req.query.c !== "undefined") {
        if (req.query.c === "") {
          api_url = `${url}/page/${req.query.p}`;
        } else {
          api_url = `${url}/category/${req.query.c}/page/${req.query.p}`;
        }
      }
    }
    let result = [];
    await axios(api_url, config)
      .then((res) => {
        const $ = cheerio.load(res.data);
        let movie = [];
        let page = [];
        const selector = "div.items > div.item";
        $(selector).each((id, elem) => {
          const title = $(elem).find("div.fixyear > h2").text();
          const year = $(elem).find("div.fixyear > span").text();
          const imgUrl = $(elem).find("div.image > img").attr("data-src");
          const quality = $(elem).find("span.calidad2").text();
          const rating = $(elem).find("span.imdbs").text();
          const info = $(elem).find("span.ttx").text();
          const link = $(elem).find("a").attr("href");
          movie.push({ title, year, imgUrl, quality, rating, link, info });
        });
        const selectorPage = "div.paginado > ul > li";
        const current = parseInt($(selectorPage).find("a.current").text());
        let last = "";
        if (
          typeof $(selectorPage).last().find("a").attr("href") === "undefined"
        ) {
          last = parseInt($(selectorPage).last().text());
        } else {
          last = parseInt(
            $(selectorPage)
              .last()
              .find("a")
              .attr("href")
              .split("/")
              .slice(-2)[0]
          );
        }
        page = { current, last };
        result = { page, movie };
      })
      .catch((err) => {
        result = [];
      });
    res.status(200).json(result);
    return;
  }

  if (req.query.d === "category") {
    let result = [];
    await axios(api_url, config)
      .then((res) => {
        const $ = cheerio.load(res.data);
        const selector = "li.cat-item";
        $(selector).each((id, elem) => {
          const cat = $(elem).find("a").text();
          const link = $(elem).find("a").attr("href");
          result.push({ cat, link });
        });
      })
      .catch((err) => {
        result = [];
      });
    res.status(200).json(result);
    return;
  }

  if (req.query.d === "player") {
    if (typeof req.query.l !== "undefined") {
      api_url = `${url}/${req.query.l}`;
      let result = [];
      await axios(api_url, config)
        .then((res) => {
          const $ = cheerio.load(res.data);

          const selector = "div.entry-content";
          let link = $(selector).find("script").text();

          if (link === "") {
            link = [];
            $(selector + " div > p > a").each((id, elem) => {
              const episode = $(elem).text();
              const url = $(elem).attr("href");
              if (episode.search("EPISODE") === 0) {
                link.push({ episode, url });
              }
            });
            result = { link };
          } else {
            link = link.split("'")[9] + link.split("'")[5];
            result = { link };
          }

          return result;
        })
        .catch((err) => {
          result = [];
        });
      res.status(200).json(result);
      return;
    }
    res.status(200).json([]);
    return;
  }
  res.status(200).json([]);
  return;
}
