import type { RequestHandler } from './$types';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { existsSync } from 'fs';
import { join } from 'path';

const fontsLoaded = {
	black: false,
	light: false
};

try {
	const blackPath = join(process.cwd(), 'static', 'fonts', 'Montserrat-Black.ttf');
	const lightPath = join(process.cwd(), 'static', 'fonts', 'Montserrat-Light.ttf');

	console.log('Checking font paths:');
	console.log('  Black:', blackPath, '→ exists:', existsSync(blackPath));
	console.log('  Light:', lightPath, '→ exists:', existsSync(lightPath));

	if (existsSync(blackPath)) {
		registerFont(blackPath, { family: 'Montserrat', weight: '900' });
		fontsLoaded.black = true;
		console.log('✓ Montserrat Black (900) registered');
	} else {
		console.warn('⚠ Montserrat-Black.ttf not found at:', blackPath);
	}

	if (existsSync(lightPath)) {
		registerFont(lightPath, { family: 'Montserrat', weight: '300' });
		fontsLoaded.light = true;
		console.log('✓ Montserrat Light (300) registered');
	} else {
		console.warn('⚠ Montserrat-Light.ttf not found at:', lightPath);
	}
} catch (err) {
	console.error('❌ Font registration failed:', err.message);
}

const titleSize = '100px';
const subtitleSize = '38px';

const titleFont = fontsLoaded.black
	? `900 ${titleSize} "Montserrat", Arial, sans-serif`
	: `bold ${titleSize} Arial, sans-serif`;

const subtitleFont = fontsLoaded.light
	? `300 ${subtitleSize} "Montserrat", Arial, sans-serif`
	: `normal ${subtitleSize} Arial, sans-serif`;
export const GET: RequestHandler = async ({ url }) => {
	const title = url.searchParams.get('title') || 'TITLE';
	const subtitle = url.searchParams.get('subtitle') || 'Subtitle text';
	const primary = url.searchParams.get('primary') || '#701a75';
	const secondary = url.searchParams.get('secondary') || '#a855f7';

	const backgroundPath = join(process.cwd(), 'static', 'background.png');
	const background = await loadImage(backgroundPath);

	const canvas = createCanvas(2072, 256);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(background, 0, 0);

	const lineX = 80;
	const lineTop = 140;
	const lineBottom = 220;

	const lineGradient = ctx.createLinearGradient(lineX, lineTop, lineX, lineBottom);
	lineGradient.addColorStop(1, primary);
	lineGradient.addColorStop(0, secondary);

	ctx.strokeStyle = lineGradient;
	ctx.lineWidth = 6;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(lineX, lineTop);
	ctx.lineTo(lineX, lineBottom);
	ctx.stroke();

	ctx.font = titleFont;
	ctx.textBaseline = 'top';

	const titleX = 70;
	const titleY = 10;
	const titleHeight = 100;

	const titleMetrics = ctx.measureText(title);

	const titleGradient = ctx.createLinearGradient(
		titleX,
		titleY,
		titleX + titleMetrics.width,
		titleY + titleHeight
	);
	titleGradient.addColorStop(0, primary);
	titleGradient.addColorStop(1, secondary);

	ctx.fillStyle = titleGradient;
	ctx.fillText(title, titleX, titleY);

	ctx.fillStyle = '#ffffff';
	ctx.font = subtitleFont;
	ctx.textBaseline = 'top';

	const subtitleX = 110;
	let subtitleY = 130;
	const maxWidth = 800;
	const words = subtitle.split(' ');
	let line = '';
	const lineHeight = 50;

	for (let n = 0; n < words.length; n++) {
		const testLine = line + words[n] + ' ';
		const metrics = ctx.measureText(testLine);
		if (metrics.width > maxWidth && n > 0) {
			ctx.fillText(line, subtitleX, subtitleY);
			line = words[n] + ' ';
			subtitleY += lineHeight;
		} else {
			line = testLine;
		}
	}
	ctx.fillText(line, subtitleX, subtitleY);

	const buffer = canvas.toBuffer('image/png');

	return new Response(buffer, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
