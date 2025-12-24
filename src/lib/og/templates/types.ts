import type { z } from 'zod';


export type SatoriElement = {
	type: string;
	props: {
		style?: Record<string, unknown>;
		children?: SatoriElement | SatoriElement[] | string | (SatoriElement | string | false | null | undefined)[];
		src?: string;
		[key: string]: unknown;
	};
};


export const OG_DIMENSIONS = {
	width: 1200,
	height: 630
} as const;

export interface TemplateConfig {
	width: number;
	height: number;
}


export interface Template<TProps extends z.ZodType = z.ZodType> {
	name: string;
	description: string;
	schema: TProps;
	defaultConfig: TemplateConfig;
	render: (props: z.infer<TProps>, config: TemplateConfig) => SatoriElement;
}


export function defineTemplate<TSchema extends z.ZodType>(template: Template<TSchema>): Template<TSchema> {
	return template;
}
