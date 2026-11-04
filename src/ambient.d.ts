// satori's fork of opentype.js ships without types; only measuring and outlining text are used
declare module '@shuding/opentype.js' {
	export interface Font {
		getAdvanceWidth(text: string, fontSize: number): number;
		getPath(
			text: string,
			x: number,
			y: number,
			fontSize: number
		): { toPathData(decimals?: number): string };
	}
	export function parse(buffer: ArrayBuffer): Font;
}
