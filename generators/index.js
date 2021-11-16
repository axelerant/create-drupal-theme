const Generator = require('yeoman-generator');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const taskPrompt = [
  {
    type: 'list',
    name: 'task',
    choices: ['theme', 'component'],
    message: 'Please choose what you would like to generate?',
  },
];

const themePrompt = [
  {
    type: 'input',
    name: 'name',
    message: 'Please enter the theme name:',
  },
  {
    type: 'confirm',
    name: 'cypress',
    message: 'Would you like to enable Cypress?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'lighthouse',
    message: 'Would you like to enable Lighthouse?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'rtl',
    message: 'Would you like to enable RTL support?',
    default: false,
  },
  {
    type: 'list',
    name: 'designSystem',
    choices: ['None', 'PatternLab', 'Storybook'],
    message: 'Which design system would you like to you',
    default: 'None',
  },
];
const componentPrompt = [
  {
    type: 'input',
    name: 'name',
    message: 'Please enter the component name:',
  },
  {
    type: 'list',
    name: 'type',
    choices: ['atom', 'molecule', 'organism', 'template', 'page'],
    message: 'Choose the type of the component',
  },
  {
    type: 'checkbox',
    name: 'files',
    choices: ['sass', 'typescript', 'json', 'twig', 'markdown', 'stories'],
    message: 'Choose the files you to generate?',
  },
];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.taskProps = null;
    this.themeProps = null;
    this.theme = null;
    this.deps = [];
    this.dsValue = {
      injectCss: ``,
      injectJs: ``,
      dsServe: ``,
      dsBuild: ``,
      dsTask: ``,
    };
  }

  async prompting() {
    return this.prompt(taskPrompt).then((props) => {
      this.taskProps = props;
    });
  }

  async writing() {
    const { task } = this.taskProps;

    if (task === 'theme') {
      this.themeProps = await this.prompt(themePrompt);
      this._generateTheme(this.themeProps);
    } else if (task === 'component') {
      const files = fs.readdirSync(process.cwd());
      if (!files.find((i) => i.indexOf('components') > -1)) {
        console.error(
          chalk.red("There isn't any components directory in this path"),
        );
        process.exit(1);
      }

      const props = await this.prompt(componentPrompt);
      this._generateComponent(props);
    }
  }

  install() {
    if (this.deps.length) {
      this.scheduleInstallTask(
        'yarn',
        this.deps,
        { dev: true, silent: true },
        { cwd: this.theme },
      );
    }
  }

  end() {
    if (this.taskProps.task === 'theme') {
      const packageJSON = path.join(process.cwd(), this.theme, 'package.json');
      const packageContents = JSON.parse(fs.readFileSync(packageJSON, 'utf8'));
      if (this.themeProps.designSystem === 'PatternLab') {
        packageContents.scripts.postinstall =
          'npx crlf --set=LF node_modules/.bin/patternlab';
        execSync(
          `npx crlf --set=LF ${this.theme}/node_modules/.bin/patternlab`,
          {
            stdio: 'ignore',
          },
        );
      }

      fs.writeFileSync(packageJSON, JSON.stringify(packageContents, null, 2));
    }
  }

  _generateTheme({ name, cypress, lighthouse, rtl, designSystem }) {
    this.theme = name;

    this.fs.copy(this.templatePath('copy/'), this.destinationPath(`${name}/`), {
      globOptions: {
        dot: true,
      },
    });

    this.fs.copyTpl(
      this.templatePath('rename/cdt.breakpoints.yml'),
      this.destinationPath(`${name}/${name}.breakpoints.yml`),
      { name },
    );
    this.fs.copyTpl(
      this.templatePath('rename/cdt.info.yml'),
      this.destinationPath(`${name}/${name}.info.yml`),
      { name },
    );
    this.fs.copyTpl(
      this.templatePath('rename/cdt.libraries.yml'),
      this.destinationPath(`${name}/${name}.libraries.yml`),
      { name },
    );
    this.fs.copyTpl(
      this.templatePath('rename/cdt.theme'),
      this.destinationPath(`${name}/${name}.theme`),
      { name },
    );

    if (cypress) {
      this.fs.copy(
        this.templatePath('options/cypress/**'),
        this.destinationPath(`${name}/`),
        {
          globOptions: {
            dot: true,
          },
        },
      );

      this.deps.push(...['cypress', '@percy/cypress']);
    }

    if (lighthouse) {
      this.fs.copy(
        this.templatePath('options/lighthouse/lighthouserc.js'),
        this.destinationPath(`${name}/lighthouserc.js`),
      );
    }

    if (rtl) {
      this.rtlValue = `const rtl = require('postcss-rtlcss');
postCSSOptions.push(rtl());`;
      this.deps.push('postcss-rtlcss');
    }

    switch (designSystem) {
      case 'PatternLab':
        this._generatePatternLab();
        break;
      case 'Storybook':
        this._generateStorybook();
        break;
      case 'None':
        break;
      default:
        break;
    }

    this.fs.copyTpl(
      this.templatePath('options/rtl/scss.js'),
      this.destinationPath(`${name}/gulp-tasks/scss.js`),
      { rtlValue: this.rtlValue },
    );

    this.fs.copyTpl(
      this.templatePath('options/ds/watch.js'),
      this.destinationPath(`${name}/gulp-tasks/watch.js`),
      { ds: this.dsValue },
    );

    this.fs.copyTpl(
      this.templatePath('options/ds/default.js'),
      this.destinationPath(`${name}/gulp-tasks/default.js`),
      { ds: this.dsValue },
    );

    this.fs.copyTpl(
      this.templatePath('options/ds/gulpfile.js'),
      this.destinationPath(`${name}/gulpfile.js`),
      { ds: this.dsValue },
    );

    console.log(
      chalk.greenBright(`The ${chalk.blueBright(name)} themes was created.`),
    );
  }

  _generatePatternLab() {
    this.dsValue = {
      injectCss: `, 'inject:css'`,
      injectJs: `, 'inject:js'`,
      dsServe: `'pl:serve', `,
      dsBuild: `\n'inject',\n'pl:build',`,
      dsTask: `'inject',\n'patternlab',`,
    };
    this.fs.copy(
      this.templatePath('options/ds/copy/**'),
      this.destinationPath(`${this.theme}/`),
      {
        globOptions: {
          dot: true,
        },
      },
    );
    this.fs.copy(
      this.templatePath('options/ds/inject.js'),
      this.destinationPath(`${this.theme}/gulp-tasks/inject.js`),
    );
    this.fs.copy(
      this.templatePath('options/ds/patternlab.js'),
      this.destinationPath(`${this.theme}/gulp-tasks/patternlab.js`),
    );

    this.deps.push(
      ...[
        '@pattern-lab/cli',
        '@pattern-lab/core',
        '@pattern-lab/engine-twig-php',
        '@pattern-lab/starterkit-twig-demo',
        '@pattern-lab/uikit-workshop',
        'gulp-inject',
        'sort-stream',
      ],
    );
  }

  _generateStorybook() {
    this.dsValue = {
      injectCss: ``,
      injectJs: ``,
      dsServe: `'sb:serve', `,
      dsBuild: `\n'sb:build',`,
      dsTask: `\n'storybook',`,
    };

    this.fs.copy(
      this.templatePath('options/storybook/copy/config/**'),
      this.destinationPath(`${this.theme}/.storybook/`),
      {
        globOptions: {
          dot: true,
        },
      },
    );

    this.fs.copy(
      this.templatePath('options/storybook/copy/example/button.stories.js'),
      this.destinationPath(
        `${this.theme}/components/02-atoms/button/button.stories.js`,
      ),
    );

    this.fs.copy(
      this.templatePath('options/ds/storybook.js'),
      this.destinationPath(`${this.theme}/gulp-tasks/storybook.js`),
    );

    this.deps.push(
      ...[
        '@babel/core',
        'babel-loader',
        '@storybook/addon-a11y',
        '@storybook/addon-actions',
        '@storybook/addon-docs',
        '@storybook/addon-essentials',
        '@storybook/addon-links',
        '@storybook/html',
        'add-attributes-twig-extension',
        'twig',
        'twig-drupal-filters',
        `twig-loader@https://github.com/fourkitchens/twig-loader`,
      ],
    );
  }

  _generateComponent(props) {
    const typeMap = {
      atom: '02-atoms',
      molecule: '03-molecules',
      organism: '04-organisms',
      template: '05-templates',
      page: '06-pages',
    };
    const fileMap = {
      sass: 'scss',
      typescript: 'ts',
      twig: 'twig',
      json: 'json',
      yaml: 'yml',
      markdown: 'md',
      stories: 'stories.js',
    };
    const componentPath = path.join(
      process.cwd(),
      'components',
      typeMap[props.type],
      props.name,
    );
    if (fs.existsSync(componentPath)) {
      console.error(chalk.red('Component already exists!'));
      process.exit(1);
    }

    fs.mkdirSync(componentPath);

    props.files.forEach((file) => {
      fs.writeFileSync(
        path.join(componentPath, `${props.name}.${fileMap[file]}`),
        '',
      );
    });
    if (props.files.includes('json')) {
      const content = '{}';
      fs.writeFileSync(path.join(componentPath, `${props.name}.json`), content);
    }

    if (props.files.includes('stories')) {
      const content = `import ${props.name}Template from './${props.name}.twig';
import ${props.name}Data from './${props.name}.json';

import '@${props.type}s/${props.name}/${props.name}.css';

export default { title: '${props.type}/${props.name}' };

export const ${props.name} = () => ${props.name}Template(${props.name}Data);
`;
      fs.writeFileSync(
        path.join(componentPath, `${props.name}.stories.js`),
        content,
      );
    }

    console.log(
      chalk.greenBright(
        `The ${chalk.blueBright(props.name)} component was created.`,
      ),
    );
  }
};
