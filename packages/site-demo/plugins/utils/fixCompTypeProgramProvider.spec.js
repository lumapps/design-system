const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const fixCompTypeProgramProvider = require('./fixCompTypeProgramProvider');

const tsconfigPath = path.resolve(__dirname, '..', '..', 'tsconfig.json');
const basePath = path.dirname(tsconfigPath);
const { config } = ts.readConfigFile(tsconfigPath, filename =>
    fs.readFileSync(filename, 'utf8'),
);
const { options } = ts.parseJsonConfigFileContent(config, ts.sys, basePath, {}, tsconfigPath);

describe('fixCompTypeProgramProvider', () => {
    it('should replace component interception type', () => {
        const compPath = path.resolve(__dirname, '../../../../packages/lumx-react/src/components/list/List.tsx');
        const program = fixCompTypeProgramProvider([compPath], options)();
        const sourceFile = program.getSourceFile(compPath);

        const componentName = 'List';
        const declaration = fixCompTypeProgramProvider.getComponentDeclaration(sourceFile, componentName);
        expect(fixCompTypeProgramProvider.getText(sourceFile, declaration.type)).toEqual('React.FC<ListProps>');
    });
});
