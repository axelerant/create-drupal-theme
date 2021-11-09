const path = require('path');
const { namespaces } = require('./setupTwig');
const cssNamespace = path.resolve(__dirname, '../dist/css');

module.exports = {
  stories: [
    '../components/**/**/*.stories.mdx',
    '../components/**/**/*.stories.@(js|ts)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      '@atoms': path.join(cssNamespace, '02-atoms'),
      '@molecules': path.join(cssNamespace, '03-molecules'),
      '@organisms': path.join(cssNamespace, '04-organisms'),
      '@templates': path.join(cssNamespace, '05-templates'),
      '@pages': path.join(cssNamespace, '06-pages'),
    };
    config.module.rules.push({
      test: /\.twig$/,
      use: [
        {
          loader: 'twig-loader',
          options: {
            twigOptions: {
              atoms: path.resolve(__dirname, '../', 'components/02-atoms'),
              molecules: path.resolve(
                __dirname,
                '../',
                'components/03-molecules',
              ),
              organisms: path.resolve(
                __dirname,
                '../',
                'components/04-organisms',
              ),
              templates: path.resolve(
                __dirname,
                '../',
                'components/05-templates',
              ),
              pages: path.resolve(__dirname, '../', 'components/06-pages'),
            },
          },
        },
      ],
    });

    return config;
  },
};
