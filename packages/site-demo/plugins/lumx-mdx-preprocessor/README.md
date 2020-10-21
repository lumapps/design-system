This plugin intercepts MDX file loading to preprocess `<DemoBlock />` and `<PropTable />` components.

Both transformations were first implemented using a remark plugin (manipulation MDX AST rather than string), but a bug
made it impossible to inject `import` statements for the code loaded by `<DemoBlock />` so it is now implemented as a
file preprocessor to execute before the MDX AST parsing.