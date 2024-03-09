export type Post = {
	title: string;
	slug: string;
	description?: string;
	date?: string;
	categories?: string[];
	published?: boolean;
	keywords?: string;
};

export type PageData = {
	content: ConstructorOfATypedSvelteComponent;
	metadata: Record<string, any>;
	snippets: Record<string, string>;
};
