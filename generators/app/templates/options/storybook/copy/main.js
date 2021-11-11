const path = require('path');
const componentsNamespace = path.resolve(__dirname, '../dist/components');

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
      '@': componentsNamespace,
      '@atoms': path.join(componentsNamespace, '02-atoms'),
      '@molecules': path.join(componentsNamespace, '03-molecules'),
      '@organisms': path.join(componentsNamespace, '04-organisms'),
      '@templates': path.join(componentsNamespace, '05-templates'),
      '@pages': path.join(componentsNamespace, '06-pages'),
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
