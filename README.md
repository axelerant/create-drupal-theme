# Kashmir [![NPM version][npm-image]][npm-url]
> A Drupal theme generator

## Installation
---

Install generator-kashmir using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).


```bash
npm install -g generator-kashmir
```

Then generate your new theme using the generator. Use the below command from the directory where you want the theme to be generated.

```bash
kashmir
```

[npm-image]: https://badge.fury.io/js/generator-kashmir.svg
[npm-url]: https://npmjs.org/package/generator-kashmir

## Design systems
---

The theme provides two options for design systems, [Storybook.js](https://storybook.js.org/) and [Patternlab](https://patternlab.io/). These are included as part of the theme and you can choose one of the two during the theme generation process.

The recommended option going forward would be to use Storybook as it is more modern and supports component building for numerous JS frameworks.

### Storybook.js

Refer [Storybook.js](https://storybook.js.org/) documentation for additional information about stories.


### Compile and launch storybook

```bash
yarn storybook
```

### Patternlab

```<<<< Placeholder >>>>```

## Component generation
---

Once theme is generated you can use the theme generator to build components for the theme.

Below is a example of generating story for *button* component,

```bash
╰─❯ kashmir
? Please choose what you would like to generate? component
? Please enter the component name: button
? Choose the type of the component atom
? Choose the files you to generate? sass, json, twig, markdown, stories
The button component was created.
```
The button component is already included as an example and can be viewed as part of the storybook out-of-the-box.

### Component structure

The theme genertor would ask you which files you want to generate for the the component,
- sass - *will contain the styles for component*
- json - *will contain the data for the component, ex: title, description.*
- twig - *will contain the markup for the component*
- markdown - *documentation*
- stories - *the story js file*
- typescript - *additional js file*

Based on your component needs, choose which files you need. 

Please check the button component example provided with the theme.

## Build commands
---

### Compile theme

In order to compile the assets of the theme, this also compiles sass inside components,

```bash
yarn gulp
```

### Global css

The theme provides a `global.css` file which contains all the compiled css. The global.css file is part of the global library, and can is attached inside the `*.info.yml` file.

Simply uncomment the libraries you are using,

```
libraries:
  - core/normalize
  # - <theme-name>/global
  # - <theme-name>/tailwind
```

## Additional Tooling
---

### RTL suport

We use [postcss-rtlcss](https://www.npmjs.com/package/postcss-rtlcss) for RTL support. You simply right sass as you normally would, the theme compilation will take care of generating compatible RTL CSS.

```bash
// Input SASS

h2 {
    text-align: left;
}

// Generated CSS

[dir="ltr"] h2 {
  text-align: left;
}

[dir="rtl"] h2 {
  text-align: right;
}
```

### Image minification

The theme provides inbuild minification via [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin). This is setup by default, all we have to do is to add the images under `/images` directory.

### TypeScript support

The Kashmir theme comes with support for [TypeScript](https://www.typescriptlang.org/). TypeScript provides all the features of JavaScript with additional features that come with strongly typed programming languages.

The theme provides `main.ts` file as a sample, if you uncomment the typescript code, you could see the generated `main.js` file under `/dist`.

There is no additional step needed, just add a `*.ts` file as and when needed and it shall be compiled by the theme.

### Linting & Prettier support

Linting and prettier support is included, with standard defaults. Please check `.prettierrc`, `.eslintrc` `.eslintignore`.

### Cypress testing support

[Cypress testing framework](https://www.cypress.io/) has been integrated in the theme and a sample test `home.spec.js` is provided.

You can launch cypress from the command line using the below command,

```bash
yarn cypress run
```
