const Generator = require('yeoman-generator');
const { execSync } = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

let fileContent = fs
  .readFileSync(path.join(__dirname, './templates/options/ci/frontend.yml'))
  .toString();

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
    name: 'pl',
    choices: ['None', 'PatternLab', 'Storybook'],
    message: 'Which design system would you like to you',
    default: 'None',
  },
  {
    type: 'confirm',
    name: 'ci',
    message: 'Would you like to update the .gitlab-ci.yml file?',
    default: false,
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
    this.plValue = {
      injectCss: ``,
      injectJs: ``,
      plServe: ``,
      plBuild: ``,
      plTask: ``,
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
      if (this.themeProps.pl === 'PatternLab') {
        packageContents.scripts.postinstall =
          'npx crlf --set=LF node_modules/.bin/patternlab';
      } else if (this.themeProps.pl === 'Storybook') {
        packageContents.scripts.storybook = 'start-storybook -p 5253';
        packageContents.scripts['build-storybook'] = 'build-storybook';
      }

      fs.writeFileSync(packageJSON, JSON.stringify(packageContents, null, 2));
    }
  }

  _generateTheme({ name, cypress, lighthouse, rtl, pl, ci }) {
    this.theme = name;
    if (ci) {
      try {
        const gitRoot = execSync('git rev-parse --show-toplevel')
          .toString()
          .trim();
        const ciFilePath = path.join(gitRoot, '.gitlab-ci.yml');
        if (fs.existsSync(ciFilePath)) {
          fileContent = fileContent.replace(/THEME_NAME/g, name);
          fs.appendFileSync(ciFilePath, fileContent);
        } else {
          fs.writeFileSync(ciFilePath, fileContent);
        }
      } catch {
        console.error(
          chalk.red(
            `This project doesn't have a ${chalk.greenBright(
              '.gitlab-ci.yml',
            )} in the root directory.`,
          ),
        );
        process.exit(1);
      }
    }

    this.fs.copy(
      this.templatePath('copy/**'),
      this.destinationPath(`${name}/`),
      {
        globOptions: {
          dot: true,
        },
      },
    );

    this.fs.copyTpl(
      this.templatePath('rename/kashmir.breakpoints.yml'),
      this.destinationPath(`${name}/${name}.breakpoints.yml`),
      { name },
    );
    this.fs.copyTpl(
      this.templatePath('rename/kashmir.info.yml'),
      this.destinationPath(`${name}/${name}.info.yml`),
      { name },
    );
    this.fs.copyTpl(
      this.templatePath('rename/kashmir.libraries.yml'),
      this.destinationPath(`${name}/${name}.libraries.yml`),
      { name },
    );
    this.fs.copyTpl(
      this.templatePath('rename/kashmir.theme'),
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

    if (pl) {
      switch (pl) {
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
    }

    this.fs.copyTpl(
      this.templatePath('options/rtl/scss.js'),
      this.destinationPath(`${name}/gulp-tasks/scss.js`),
      { rtlValue: this.rtlValue },
    );

    this.fs.copyTpl(
      this.templatePath('options/pl/watch.js'),
      this.destinationPath(`${name}/gulp-tasks/watch.js`),
      { pl: this.plValue },
    );

    this.fs.copyTpl(
      this.templatePath('options/pl/default.js'),
      this.destinationPath(`${name}/gulp-tasks/default.js`),
      { pl: this.plValue },
    );

    this.fs.copyTpl(
      this.templatePath('options/pl/gulpfile.js'),
      this.destinationPath(`${name}/gulpfile.js`),
      { pl: this.plValue },
    );

    console.log(
      chalk.greenBright(`The ${chalk.blueBright(name)} themes was created.`),
    );
  }

  _generatePatternLab() {
    this.plValue = {
      injectCss: `, 'inject:css'`,
      injectJs: `, 'inject:js'`,
      plServe: `'pl:serve', `,
      plBuild: `\n'inject',\n'pl:build',`,
      plTask: `'inject',\n'patternlab',`,
    };
    this.fs.copy(
      this.templatePath('options/pl/copy/**'),
      this.destinationPath(`${this.theme}/`),
      {
        globOptions: {
          dot: true,
        },
      },
    );
    this.fs.copy(
      this.templatePath('options/pl/inject.js'),
      this.destinationPath(`${this.theme}/gulp-tasks/inject.js`),
    );
    this.fs.copy(
      this.templatePath('options/pl/patternlab.js'),
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
    this.fs.copy(
      this.templatePath('options/storybook/copy/**'),
      this.destinationPath(`${this.theme}/.storybook/`),
      {
        globOptions: {
          dot: true,
        },
      },
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
    if (props.files.includes('stories')) {
      const contents = `import ${props.name}Template from './${props.name}.twig';
import ${props.name}Data from './${props.name}.json';

import '@${props.type}/${props.name}/${props.name}.css';

export default { title: '${props.type}/${props.name}' };

export const ${props.name} = () => ${props.name}Template(${props.name}Data);`;
      fs.writeFileSync(
        path.join(componentPath, `${props.name}.stories.js`),
        contents,
      );
    }

    console.log(
      chalk.greenBright(
        `The ${chalk.blueBright(props.name)} component was created.`,
      ),
    );
  }
};
