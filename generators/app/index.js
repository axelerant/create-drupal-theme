const Generator = require('yeoman-generator');
const { execSync } = require('child_process');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const fs = require('fs');

let fileContent = fs
  .readFileSync(path.join(__dirname, './templates/options/ci/frontend.yml'))
  .toString();

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.deps = [];
    this.rtlValue = '';
    this.plValue = {
      injectCss: '',
      injectJs: '',
      plServe: '',
      plTask: '',
    };
  }

  async prompting() {
    this.log(yosay(`Welcome fellow ${chalk.blue('Drupaler')}!`));

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Would you like to name the theme?',
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

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    const { name, cypress, lighthouse, rtl, pl, ci } = this.props;

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
        console.log(`You aren't in a Git Repository.`);
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
        plBuild: `, 'pl:build'`,
        plTask: `'patternlab',\n  'inject',`,
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
  }

  install() {
    const { name } = this.props;
    this.scheduleInstallTask('yarn', this.deps, { dev: true }, { cwd: name });
  }

  end() {}
};
