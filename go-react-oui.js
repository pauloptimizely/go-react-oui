const { Generator } = require('goman')
const inquirerDirectory = require('inquirer-directory')
const toSlugCase = require('to-slug-case')

const help = `

g react-oui -c [name] -d [baseDir]

name - component name
baseDir - component's base directory
`

module.exports = class extends Generator {
  constructor(opts) {
    super(opts);
    this.inquirer.registerPrompt('directory', inquirerDirectory);
    this.props = {}
  }

  mapArgsToProps() {
    this.props.componentName = this.argv.c;
    this.props.componentDir = this.argv.d;

    return Promise.resolve(() => {
      this.props = Object.assign({}, this.props, props)
    });
  }

  validateProps() {
    const { componentName, componentDir } = this.props
    let errors = [];

    if (!componentName) errors.push('Invalid component name.');
    if (!componentDir) errors.push('Invalid component base directory.');

    this.props.errors = errors;
  }

  prompting() {
    return this.mapArgsToProps()
      .then(this.validateProps.bind(this));
  }

  writing() {
    if (this.props.errors.length > 0) {
      return this.logger.logError(`${ this.props.errors.join(' ') } ${ help }`);
    }

    const name = this.props.componentName;
    const dir = this.props.componentDir || process.cwd();

    this.fs.copyTpl(
      this.templatePath('./component.tmpl.js'),
      this.destinationPath(`${dir}/${name}/${name}.js`),
      { ...this.props, componentSlugName: toSlugCase(this.props.componentName) }
    );

    this.fs.copyTpl(
      this.templatePath('./component.tmpl.spec.js'),
      this.destinationPath(`${dir}/${name}/tests/index.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('./component.tmpl.story.js'),
      this.destinationPath(`${dir}/${name}/${name}.story.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('./example.tmpl.js'),
      this.destinationPath(`${dir}/${name}/examples/index.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('./index.tmpl.js'),
      this.destinationPath(`${dir}/${name}/index.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('./README.tmpl.md'),
      this.destinationPath(`${dir}/${name}/README.md`),
      this.props
    );

  }
}
