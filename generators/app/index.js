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
  },
  {
    type: 'confirm',
    name: 'lighthouse',
    message: 'Would you like to enable Lighthouse?',
  },
  {
    type: 'confirm',
    name: 'rtl',
    message: 'Would you like to enable RTL support?',
  },
  {
    type: 'confirm',
    name: 'pl',
    message: 'Would you like to use Pattern Lab?',
  },
  {
    type: 'confirm',
    name: 'ci',
    message: 'Would you like to update the .gitlab-ci.yml file?',
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
    choices: ['sass', 'typescript', 'json', 'twig', 'markdown'],
    message: 'Choose the files you to generate?',
  },
];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.props = null;
    this.theme = null;
    this.deps = [];
  }

  async prompting() {
    return this.prompt(taskPrompt).then((props) => {
      this.props = props;
    });
  }

  async writing() {
    const { task } = this.props;

    if (task === 'theme') {
      const props = await this.prompt(themePrompt);
      this._generateTheme(props);
    } else if (task === 'component') {
      const files = fs.readdirSync(process.cwd());
      if (!files.find((i) => i.indexOf('patterns') > -1)) {
        console.error(
          chalk.red("There isn't any patterns directory in this path"),
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

  end() {}

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
        console.error(chalk.red(`You aren't in a Git Repository!`));
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
      this.plValue = {
        injectCss: `, 'inject:css'`,
        injectJs: `, 'inject:js'`,
        plServe: `'pl:serve', `,
        plBuild: `\n'inject',\n'pl:build',`,
        plTask: `'inject',\n'patternlab',`,
      };
      this.fs.copy(
        this.templatePath('options/pl/copy/**'),
        this.destinationPath(`${name}/`),
        {
          globOptions: {
            dot: true,
          },
        },
      );
      this.fs.copy(
        this.templatePath('options/pl/inject.js'),
        this.destinationPath(`${name}/gulp-tasks/inject.js`),
      );
      this.fs.copy(
        this.templatePath('options/pl/patternlab.js'),
        this.destinationPath(`${name}/gulp-tasks/patternlab.js`),
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
    };
    const componentPath = path.join(
      process.cwd(),
      'patterns',
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

    console.log(
      chalk.greenBright(
        `The ${chalk.blueBright(props.name)} component was created.`,
      ),
    );
  }
};
