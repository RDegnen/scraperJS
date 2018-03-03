const rp = require('request-promise');

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

const fetchProxies = () =>
  // fetch proxy list, unpack ip, port, and return a random proxy
  new Promise((resolve, reject) => {
    const proxyApiKey = process.env.PROXY_API_KEY;
    const options = {
      url: `https://api.myprivateproxy.net/v1/fetchProxies/json/full/${proxyApiKey}`,
      transform: (body) => {
        const proxies = JSON.parse(body);
        const { proxy_ip, proxy_port } = proxies[Math.floor(Math.random() * proxies.length)];
        return `http://${proxy_ip}:${proxy_port}`;
      },
    };
    rp(options)
      .then((data) => {
        resolve(data);
      })
      .catch(err => reject(err));
  });

const collectCraigslistHtml = (req, proxy) =>
  new Promise((resolve, reject) => {
    let { location } = req.body;
    location = location.split(' ').join('');

    const terms = req.body.terms.map(t => t.split(' ').join('+'));

    const rp1 = rp({ url: `https://${location}.craigslist.org/search/eng?query=${terms[0]}`, proxy });
    const rp2 = rp({ url: `https://${location}.craigslist.org/search/sof?query=${terms[0]}`, proxy });
    const rp3 = rp({ url: `https://${location}.craigslist.org/search/web?query=${terms[0]}`, proxy });
    // Run all 3 request-promise promises and return array of html results
    Promise.all([rp1, rp2, rp3])
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });

const collectIndeedHtml = (req, proxy) =>
  new Promise((resolve, reject) => {
    let { location } = req.body;
    if (location.split(' ').length > 1) location = location.split(' ').join('+');

    const urls = [];
    const terms = req.body.terms.map(t => t.split(' ').join('+'));
    // Add + between terms for indeed search. Then loop over terms and within that loop
    // over pages so there is the specified amount of pages for each term.
    if (req.body.pages < 1) req.body.pages = 1;
    for (let i = 0; i < terms.length; i++) {
      for (let p = 0; p < req.body.pages; p++) {
        let url;
        if (p === 0) url = `https://www.indeed.com/jobs?q=${terms[i]}&l=${location}`;
        else url = `https://www.indeed.com/jobs?q=${terms[i]}&l=${location}&start=${p * 10}`;
        urls.push(rp({ url, proxy }));
      }
    }
    Promise.all(urls)
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });

const collectStackOverflowHtml = (req, proxy) =>
  new Promise((resolve, reject) => {
    let { location } = req.body;
    if (location.split(' ').length > 1) location = location.split(' ').join('+');

    const urls = [];
    const terms = req.body.terms.map(t => t.split(' ').join('+'));
    // Same as Indeed
    if (req.body.pages < 1) req.body.pages = 1;
    for (let i = 0; i < terms.length; i++) {
      for (let p = 0; p < req.body.pages; p++) {
        let url;
        if (p === 0) url = `https://stackoverflow.com/jobs?sort=i&q=${terms[i]}&l=${location}&d=20&u=Miles`;
        else url = `https://stackoverflow.com/jobs?sort=i&q=${terms[i]}&l=${location}&d=20&u=Miles&sort=i&pg=${i}`;
        urls.push(rp({ url, proxy }));
      }
    }
    Promise.all(urls)
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });

module.exports = {
  fetchProxies,
  collectCraigslistHtml,
  collectIndeedHtml,
  collectStackOverflowHtml,
};
