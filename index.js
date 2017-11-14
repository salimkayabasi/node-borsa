const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');

const url = 'http://bigpara.hurriyet.com.tr/borsa/canli-borsa/';

module.exports = Borsa = class Borsa {

  async request() {
    return axios(url).then((response) => response.data);
  }

  parse(html) {
    const $ = cheerio.load(html);
    return _.map($('#sortable ul.live-stock-item'), (item) => {
      const name = $(item).data('symbol');
      const price = _.toNumber($(item).children(`#h_td_fiyat_id_${name}`).text().replace(',', '.'));
      return {
        name,
        price
      }
    });
  }

  async run() {
    const html = await this.request();
    return this.parse(html);
  }

};

const run = async () => {
  const borsa = new Borsa();
  return await borsa.run();
};

run().then((data) => {
  console.log(data);
});
