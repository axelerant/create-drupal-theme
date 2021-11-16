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
      '@atoms': path.join(componentsNamespace, 'atoms'),
      '@molecules': path.join(componentsNamespace, 'molecules'),
      '@organisms': path.join(componentsNamespace, 'organisms'),
      '@templates': path.join(componentsNamespace, 'templates'),
      '@pages': path.join(componentsNamespace, 'pages'),
    };
    config.module.rules.push({
      test: /\.twig$/,
      use: [
        {
          loader: 'twig-loader',
          options: {
            twigOptions: {
              atoms: path.resolve(__dirname, '../', 'components/atoms'),
              molecules: path.resolve(
                __dirname,
                '../',
                'components/molecules',
              ),
              organisms: path.resolve(
                __dirname,
                '../',
                'components/organisms',
              ),
              templates: path.resolve(
                __dirname,
                '../',
                'components/templates',
              ),
              pages: path.resolve(__dirname, '../', 'components/pages'),
            },
          },
        },
      ],
    });

    return config;
  },
};
