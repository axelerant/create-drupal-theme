const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.deps = [];
    this.rtlValue = "";
  }

  async prompting() {
    this.log(yosay(`Welcome fellow ${chalk.blue("Drupaler")}!`));

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Would you like to name the theme?",
      },
      {
        type: "confirm",
        name: "cypress",
        message: "Would you like to enable Cypress?",
      },
      {
        type: "confirm",
        name: "lighthouse",
        message: "Would you like to enable Lighthouse?",
      },
      {
        type: "confirm",
        name: "rtl",
        message: "Would you like to enable RTL support?",
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    const { name, cypress, lighthouse, rtl } = this.props;
    this.fs.copy(
      this.templatePath("copy/**"),
      this.destinationPath(`${name}/`),
      {
        globOptions: {
          dot: true,
        },
      }
    );

    this.fs.copyTpl(
      this.templatePath("rename/kashmir.breakpoints.yml"),
      this.destinationPath(`${name}/${name}.breakpoints.yml`),
      { name: name }
    );
    this.fs.copyTpl(
      this.templatePath("rename/kashmir.info.yml"),
      this.destinationPath(`${name}/${name}.info.yml`),
      { name: name }
    );
    this.fs.copyTpl(
      this.templatePath("rename/kashmir.libraries.yml"),
      this.destinationPath(`${name}/${name}.libraries.yml`),
      { name: name }
    );
    this.fs.copyTpl(
      this.templatePath("rename/kashmir.theme"),
      this.destinationPath(`${name}/${name}.theme`),
      { name: name }
    );

    if (cypress) {
      this.fs.copy(
        this.templatePath("options/cypress/**"),
        this.destinationPath(`${name}/`),
        {
          globOptions: {
            dot: true,
          },
        }
      );

      this.deps.push(...["cypress", "@percy/cypress"]);
    }

    if (lighthouse) {
      this.fs.copy(
        this.templatePath("options/lighthouse/lighthouserc.js"),
        this.destinationPath(`${name}/lighthouserc.js`)
      );
    }

    if (rtl) {
      this.rtlValue = `const rtl = require("postcss-rtlcss");
postCSSOptions.push(rtl())`;
      this.deps.push("postcss-rtlcss");
    }

    this.fs.copyTpl(
      this.templatePath("options/rtl/scss.js"),
      this.destinationPath(`${name}/gulp-tasks/scss.js`),
      { rtlValue: this.rtlValue }
    );
  }

  install() {
    const { name } = this.props;
    this.scheduleInstallTask(
      "npm",
      this.deps,
      { "save-dev": true },
      { cwd: name }
    );
  }

  end() {}
};
