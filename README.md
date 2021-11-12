# Create Drupal Theme [![NPM version][npm-image]][npm-url]
> A Drupal theme and component generator.

## Installation
---

Install create-drupal-theme using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).


```bash
npm install -g create-drupal-theme
```

Then generate your new theme using the generator. Use the below command from the directory where you want the theme to be generated.

```bash
create-drupal-theme
```

[npm-image]: https://badge.fury.io/js/generator-kashmir.svg
[npm-url]: https://npmjs.org/package/generator-kashmir


## Build commands
---

### Compile theme

In order to compile the assets of the theme, this also compiles sass inside components,

```bash
yarn gulp
```

### Global Libraries

The theme provides a global CSS file at  `./components/global.scss` file which contains all the sitewide styles. 

The generated file at `./dist/components/global.css` file is part of the global library, and can is attached inside the `*.info.yml` file.

The theme provides a global TS file at `./components/global.ts` which contains all site wide javascript code. 

The generated file at `./dist/components/global.js` file is part of the global library, and is attached inside the `*.info.yml` file.

Simply uncomment the libraries you are using,

```
libraries:
  - core/normalize
  # - <theme-name>/global
  # - <theme-name>/tailwind
```

## Design systems
---

The theme provides two options for design systems, [Storybook.js](https://storybook.js.org/) and [Patternlab](https://patternlab.io/). These are included as part of the theme and you can choose one of the two during the theme generation process.

The recommended option going forward would be to use Storybook as it is more modern and supports component building for numerous JS frameworks.

### Storybook.js

Refer [Storybook.js](https://storybook.js.org/) documentation for additional information about stories.


#### Build Storybook

```bash
yarn gulp
```

#### Build, Launch and watch Storybook

```bash
yarn gulp watch
```

### Patternlab

Refer [Patternlab](https://patternlab.io/docs/overview-of-patterns) documentation for additional information about patternlab.

#### Build Patternlab

```bash
yarn gulp
```

#### Build, Launch and watch Patternlab

```bash
yarn gulp watch
```

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

### Tailwind

By default all themes generated will have tailwind related config but disabled by default. 

To enable tailwind support on your generated theme,



### Contribution guidelines

#### **Did you find a bug?**

* **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/axelerant/kashmir/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/axelerant/kashmir/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or a **scenario** demonstrating the expected behavior that is not occurring.

#### **Did you write a patch that fixes a bug?**

* Open a new GitHub pull request with the patch.

* Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.
