import * as TJS from 'typescript-json-schema';
import path from 'path';
import fs from 'fs';

// ========== CONFIG ==========
const settings: TJS.PartialArgs = {
  required: true,
  noExtraProps: true,
  titles: true,
  ref: false,
  topRef: true,
};

const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
  skipLibCheck: true,
  types: [],
  lib: ['es2019'],
};

// ========== PATH ==========
const baseDir = path.resolve(__dirname, '../../shared/dto');
const outputDir = path.resolve(__dirname, '../schemas');
fs.mkdirSync(outputDir, { recursive: true });

// ========== UTILITY ==========
function mergeSchemas(moduleName: string, generator: TJS.JsonSchemaGenerator) {
  const merged: any = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {},
  };

  const symbols = generator.getUserSymbols();

  // Chỉ giữ các type có hậu tố Dto hoặc Response
  const dtoSymbols = symbols.filter(
    (name) => /(Response|Dto|CreateDto|UpdateDto)$/i.test(name) && !/^Base|^Named|Base$/i.test(name)
  );

  for (const symbol of dtoSymbols) {
    const schema = generator.getSchemaForSymbol(symbol);
    merged.definitions[symbol] = schema.definitions?.[symbol] ?? schema;
  }

  const outPath = path.join(outputDir, `${moduleName}-schemas.json`);
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
  console.log(`Generated module: ${moduleName} (${dtoSymbols.length} DTOs)`);

  return outPath;
}

// ========== MAIN ==========
const modules = fs
  .readdirSync(baseDir)
  .filter((f) => fs.statSync(path.join(baseDir, f)).isDirectory());

const generatedFiles: string[] = [];

for (const moduleName of modules) {
  const dtoPath = path.join(baseDir, moduleName);
  const dtoFiles = fs
    .readdirSync(dtoPath)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => path.join(dtoPath, f));

  if (!dtoFiles.length) continue;

  const program = TJS.getProgramFromFiles(dtoFiles, compilerOptions);
  const generator = TJS.buildGenerator(program, settings);

  if (!generator) {
    console.warn(`Skipped module "${moduleName}" — cannot build schema`);
    continue;
  }

  const moduleFile = mergeSchemas(moduleName, generator);
  generatedFiles.push(moduleFile);
}

// (Optional) Merge all schemas into one
if (generatedFiles.length) {
  const allSchemas: any = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {},
  };

  for (const file of generatedFiles) {
    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    Object.assign(allSchemas.definitions, json.definitions);
  }

  fs.writeFileSync(path.join(outputDir, 'all-schemas.json'), JSON.stringify(allSchemas, null, 2));

  console.log(`Merged all modules → schemas/all-schemas.json`);
}
