/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://getclaros.in',
  generateRobotsTxt: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*'],
  additionalPaths: async () => {
    const paths = [];

    const loanConfigs = {
      'home-loan': {
        amounts: ['10-lakh', '20-lakh', '25-lakh', '30-lakh', '40-lakh', '50-lakh', '60-lakh', '75-lakh', '1-crore'],
        rates: ['7.5', '8', '8.5', '9', '9.5'],
        tenures: ['10', '15', '20', '25', '30'],
      },
      'car-loan': {
        amounts: ['3-lakh', '5-lakh', '8-lakh', '10-lakh', '15-lakh', '20-lakh'],
        rates: ['8', '8.5', '9', '9.5', '10'],
        tenures: ['3', '5', '7'],
      },
      'personal-loan': {
        amounts: ['1-lakh', '2-lakh', '3-lakh', '5-lakh', '10-lakh'],
        rates: ['10', '11', '12', '14', '16'],
        tenures: ['1', '2', '3', '5'],
      },
      'education-loan': {
        amounts: ['5-lakh', '10-lakh', '15-lakh', '20-lakh', '30-lakh', '50-lakh'],
        rates: ['8', '8.5', '9', '9.5', '10'],
        tenures: ['5', '7', '10', '15'],
      },
    };

    for (const [loan, config] of Object.entries(loanConfigs)) {
      for (const amount of config.amounts.slice(0, 5)) {
        for (const rate of config.rates.slice(0, 4)) {
          for (const tenure of config.tenures.slice(0, 3)) {
            paths.push({
              loc: `/loans/${loan}/${amount}/${rate}-percent/${tenure}-years`,
              changefreq: 'monthly',
              priority: 0.6,
              lastmod: new Date().toISOString(),
            });
          }
        }
      }
    }

    const incomes = [
      '5-lpa', '6-lpa', '7-lpa', '8-lpa', '9-lpa', '10-lpa',
      '12-lpa', '15-lpa', '18-lpa', '20-lpa', '25-lpa', '30-lpa',
      '40-lpa', '50-lpa', '75-lpa', '1-crore',
    ];

    for (const income of incomes) {
      paths.push({
        loc: `/tax/fy-2025-26/${income}`,
        changefreq: 'yearly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    }

    return paths;
  },
};
