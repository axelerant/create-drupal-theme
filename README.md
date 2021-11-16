[![NPM version][npm-image]][npm-url]

[npm-image]: https://badge.fury.io/js/create-drupal-theme.svg
[npm-url]: https://npmjs.org/package/create-drupal-theme

# Create Drupal Theme

> A Drupal Theme and Component generator.

## Requirements

- [Node.js](https://nodejs.org/) version 14 or above
- [PHP](https://www.php.net/) version 7.2 or above
- [npm](https://npmjs.com/package/npm)
- [Yarn](https://yarnpkg.com/getting-started/install)

## Installation

- Using npm

  ```bash
  npm install -g create-drupal-theme
  ```

- Using yarn
  ```bash
  yarn global add create-drupal-theme
  ```

## Usage

To choose between generating a theme or a component run:

```bash
create-drupal-theme
```

[![asciicast](https://asciinema.org/a/mnGegKyz7NoJhpCJlojnRGs7v.svg)](https://asciinema.org/a/mnGegKyz7NoJhpCJlojnRGs7v)
## Scripts

### `yarn start`

This will first build all your assets and then start watching for changes. In case you are using a design system, it will build the system and then start the development server.

The linting tasks are run development mode, so you will get errors in your terminal but it won't exit the process.

### `yarn build`

This will build all the assets in production mode. It will optimize certain assets to reduce their size.

The linting tasks are run in production mode and if there are errors the process will exit. This should be used on CI and when shipping to a production-like environment.

## Design systems

The theme provides two options for design systems, [Storybook](https://storybook.js.org/) and [Patternlab](https://patternlab.io/). You can choose which design system you would like to opt for during the theme generation process.

We recommend using Storybook as it supports multiple JavaScript frameworks and doesn't have a dependency on PHP.

### Storybook

You can refer to the [Storybook](https://storybook.js.org/) documentation to know more about how it works.

If you have opted for Storybook as the design system for your theme, the generator will automatically include all the relevant configurations and packages. It will also update the `start` and `build` commands.

- `yarn start`: To start the Storybook server on port 3000.
- `yarn build`: To build the Storybook assets. These can be found in the `storybook-static` directory.

### Patternlab

You can refer to the [Pattern Lab](https://patternlab.io/) documentation to know more about how it works.

If you have opted for PatternLab as the design system for your theme, the generator will automatically include all the relevant configurations and packages. It will also update the `start` and `build` commands.

- `yarn start`: To start the Pattern Lab server on port 3000.
- `yarn build`: To build the Pattern Lab assets. These can be found in the `public` directory.

#### Build, Launch and watch Patternlab

```bash
yarn start
```

## Component generation

You can use the generator to interactively generate components. These components are structured following the Atom design conventions and require a `components` directory with your theme.

[![asciicast](https://asciinema.org/a/449461.svg)](https://asciinema.org/a/449461)

## Additional Tooling

### RTL support

We use [postcss-rtlcss](https://www.npmjs.com/package/postcss-rtlcss) for RTL support. You don't need to explicitly write your styles to support both LTR and RTL. You just target LTR and the theme compilation will take care of generating compatible RTL styles.

**Input styles**

```css
h2 {
  text-align: left;
}
```

**Generated styles**

```
[dir="ltr"] h2 {
  text-align: left;
}

[dir="rtl"] h2 {
  text-align: right;
}
```

### Image Optimization

The theme uses [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) for optimizing your images. This is set up out of the box, all we have to do is to add images under the `/images` directory.

### TypeScript support

The theme comes supports and recommends using [TypeScript](https://www.typescriptlang.org/). TypeScript provides all the features of JavaScript with additional features that come with strongly typed programming languages.

The TypeScript files would be placed within the `components` directory. On running the `start` or `build` scripts the compiled asset is placed in the `dist` directory.

### Linting & Code Formatting support

Linting and code formatting support are included, with standard defaults. You can find the configuration in the following files: `.prettierrc`, `.eslintrc`, and `.stylelintrc`.

All the `scss`, `css`, `ts`, `js`, `json`, and `yml` files listed under the `components` directory are lint and formatted.

### Cypress support

[Cypress](https://www.cypress.io/) has been integrated with the theme and a sample test `home.spec.js` is provided.

- `yarn cypress run`: To can run cypress tests from the terminal.
- `yarn cypress open`: To start the visual browser-based test runner.

### Tailwind

The generated themes let you choose between writing custom stylesheets using Sass or using [TailwindCSS](https://tailwindcss.com/) instead. The generated TailwindCSS style is included in both the design systems and doesn't need any additional efforts.

To enable TailwindCSS support on your generated theme:

- Uncomment the contents of `tailwind.scss` inside the `components` directory.
- Uncomment the tailwind library declaration in `.libraries.yml`
  ```bash
  tailwind:
    css:
      theme:
        dist/components/tailwind.css: {}
  ```
- Enable the attachment of the library in `.info.yml` file.

  ```bash
  libraries:
    - core/normalize
  #  - <theme-name>/global
    - <theme-name>/tailwind
  ```

- We have integrated the default Tailwind setup, you can customize and optimize the integration. You can refer to [Customising Tailwind](https://tailwindcss.com/docs/installation#customizing-your-configuration) and [Optimising for production](https://tailwindcss.com/docs/optimizing-for-production) sections in the official documentation.
- Use the `build` script to generate an optimized build of the TailwindCSS stylesheet. TailwindCSS's `purge` directive is configured to generate only the relevant CSS classes used in the `components` and `templates` directories.
- The theme uses `core/normalize` from Drupal to introduce the reset styles. To avoid conflicts we have disabled the resets TailwindCSS generates in the `tailwind.config.js` file.

## Contribution guidelines

**Did you find a bug?**

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/axelerant/kashmir/issues).

- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/axelerant/kashmir/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or a **scenario** demonstrating the expected behavior that is not occurring.

**Did you write a patch that fixes a bug?**

- Open a new GitHub pull request with the patch.

- Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.
