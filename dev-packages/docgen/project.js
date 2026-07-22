const fs = require('fs');
const path = require('path');
const { Project } = require('ts-morph');

/**
 * Initialize and return the ts-morph project for parsing component files.
 *
 * `skipAddingFilesFromTsConfig` avoids eagerly parsing/binding every file matched by the
 * tsconfig's `include` globs (which, for a monorepo tsconfig, can be tens of thousands of
 * files) when we only ever need the single target component file plus whatever it imports.
 * ts-morph/the language service still resolves and loads those dependencies on demand.
 */
function createProject(projectPath) {
    return new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json'),
        skipAddingFilesFromTsConfig: true,
    });
}

/**
 * Walk up from a path looking for a directory containing the given marker file/dir.
 * @param {string} startPath - File or directory to start searching from
 * @param {string} marker - File/directory name to look for (e.g. '.git', 'tsconfig.json')
 * @returns {string|null} - The directory containing the marker, or null if not found
 */
function findAncestorWithMarker(startPath, marker) {
    let dir = fs.statSync(startPath).isDirectory() ? startPath : path.dirname(startPath);
    while (true) {
        if (fs.existsSync(path.join(dir, marker))) return dir;
        const parent = path.dirname(dir);
        if (parent === dir) return null;
        dir = parent;
    }
}

/**
 * Find the nearest ancestor directory containing a tsconfig.json.
 * @param {string} startPath - File or directory to start searching from
 * @returns {string|null} - The directory containing the tsconfig.json, or null if not found
 */
function findNearestTsConfigDir(startPath) {
    return findAncestorWithMarker(startPath, 'tsconfig.json');
}

/**
 * Find the git repository root containing a path.
 * @param {string} startPath - File or directory to start searching from
 * @returns {string} - The git root, or startPath's directory if none is found
 */
function findGitRoot(startPath) {
    const dir = fs.statSync(startPath).isDirectory() ? startPath : path.dirname(startPath);
    return findAncestorWithMarker(startPath, '.git') || dir;
}

/**
 * Get the root path used to compute relative `declarations[].fileName` values.
 * This is the git repository root containing the project, so fileName stays
 * relative to whichever repo the analyzed component lives in.
 * @param {Project} project - The ts-morph project
 * @returns {string} - The root path
 */
function getRootPath(project) {
    const configFilePath = project.getCompilerOptions().configFilePath;
    return findGitRoot(configFilePath ? path.dirname(configFilePath) : process.cwd());
}

/**
 * Get a source file from a project, adding it if necessary.
 * @param {Project} project - The ts-morph project
 * @param {string} filePath - Path to the source file
 * @returns {SourceFile|null} - The source file or null
 */
function getSourceFile(project, filePath) {
    let sourceFile = project.getSourceFile(filePath);
    if (!sourceFile) {
        sourceFile = project.addSourceFileAtPath(filePath);
    }
    return sourceFile || null;
}

/**
 * Find type by name across the project
 */
function findTypeByName(project, typeName) {
    // Search in all source files
    for (const sourceFile of project.getSourceFiles()) {
        // Check interfaces
        for (const iface of sourceFile.getInterfaces()) {
            if (iface.getName() === typeName) {
                return iface;
            }
        }

        // Check type aliases
        for (const typeAlias of sourceFile.getTypeAliases()) {
            if (typeAlias.getName() === typeName) {
                return typeAlias;
            }
        }
    }

    return null;
}

/**
 * Resolve a Props interface/type-alias declared in another file and brought in via a
 * named import in the component file (e.g. `import { FooProps } from './types'`).
 * Needed because `skipAddingFilesFromTsConfig` means only the component file itself is
 * loaded into the project — sibling files like `types.ts` are never added, so a
 * project-wide search (`findTypeByName`) won't see declarations living there.
 */
function findImportedPropsDeclaration(sourceFile, expectedPropsName) {
    for (const importDecl of sourceFile.getImportDeclarations()) {
        const hasNamedImport = importDecl.getNamedImports().some((ni) => ni.getName() === expectedPropsName);
        if (!hasNamedImport) continue;

        const importedSourceFile = importDecl.getModuleSpecifierSourceFile();
        if (!importedSourceFile) continue;

        const interfaceDecl = importedSourceFile.getInterfaces().find((decl) => decl.getName() === expectedPropsName);
        if (interfaceDecl) return interfaceDecl;

        const typeAliasDecl = importedSourceFile.getTypeAliases().find((decl) => decl.getName() === expectedPropsName);
        if (typeAliasDecl) return typeAliasDecl;
    }

    return null;
}

/**
 * Find the component interface by analyzing the source file.
 * Uses a prioritized search strategy to find the most appropriate Props type.
 */
function findComponentInterface(sourceFile, project) {
    const interfaces = sourceFile.getInterfaces();
    const typeAliases = sourceFile.getTypeAliases();
    const baseName = path.basename(sourceFile.getFilePath(), '.tsx');
    const expectedPropsName = baseName + 'Props';

    // Combine interfaces and type aliases as candidates
    const candidates = [...interfaces, ...typeAliases];

    // Prioritized search predicates (highest priority first)
    const searchStrategies = [
        // 1. Exact match: ComponentNameProps
        (decl) => decl.getName() === expectedPropsName,
        // 2. Exported interface/type ending with Props
        (decl) => decl.getName().endsWith('Props') && decl.isExported?.(),
        // 3. Any interface/type ending with Props
        (decl) => decl.getName().endsWith('Props'),
        // 4. Any exported interface
        (decl) => decl.isExported?.(),
    ];

    // Try each strategy in order
    for (const predicate of searchStrategies) {
        const match = candidates.find(predicate);
        if (match) return match;
    }

    // Follow a named import of the expected Props type into its own file
    const importedType = findImportedPropsDeclaration(sourceFile, expectedPropsName);
    if (importedType) return importedType;

    // Fall back to project-wide search for imported/re-exported types
    const projectWideType = findTypeByName(project, expectedPropsName);
    if (projectWideType) return projectWideType;

    // Last resort: first interface in file
    return interfaces[0] || null;
}

exports.createProject = createProject;
exports.findNearestTsConfigDir = findNearestTsConfigDir;
exports.getRootPath = getRootPath;
exports.getSourceFile = getSourceFile;
exports.findComponentInterface = findComponentInterface;
exports.findTypeByName = findTypeByName;
