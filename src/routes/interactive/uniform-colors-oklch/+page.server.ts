import fs from 'fs';
import path from 'path';

const loadFile = async function (filepath: string) {
	filepath = path.resolve(`src/routes/interactive/uniform-colors-oklch/${filepath}`);
	return fs.readFileSync(filepath, 'utf-8');
};

export async function load(_) {
	const codeMapper = await loadFile('mapper.ts');
	const codePaletteHue = await loadFile('paletteHue.svelte');
	const codePaletteLightness = await loadFile('paletteLightness.svelte');
	return { codeMapper, codePaletteHue, codePaletteLightness };
}
