import renderToString from './renderToString';

export default function renderToStyleTag(styleTag){
	styleTag.textContent = renderToString();
}