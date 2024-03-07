// place files you want to import through the `$lib` alias in this folder.
import * as utils from './utils';
import MdsvexComponent from './importers/mdsvex.svelte';
import { loadTaxonomy } from './importers/mdsvex';

import Header from './components/header.svelte';
import Footer from './components/footer.svelte';
import CodeDisplay from './components/codeDisplay.svelte';

import type * as types from './types';

export { MdsvexComponent, loadTaxonomy, utils, CodeDisplay, Header, Footer };
export type { types };
