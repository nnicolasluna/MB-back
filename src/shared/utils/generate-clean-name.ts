export const specialCharacters = {
	á: 'a',
	é: 'e',
	í: 'i',
	ó: 'o',
	ú: 'u',
	ü: 'u',
	Á: 'A',
	É: 'E',
	Í: 'I',
	Ó: 'O',
	Ú: 'U',
	Ü: 'U',
	ñ: 'n',
	Ñ: 'N',
};

export function generateCleanName(name: string, prefix: string = 'layer_'): string {
	const regex = new RegExp(Object.keys(specialCharacters).join('|'), 'g');

	const codetb = '_' + (Math.random() + 1).toString(36).substring(7);
	return (
		prefix +
		name
			.toLowerCase()
			.replace(/ /g, '_')
			.replace(regex, (matched) => specialCharacters[matched])
			.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') +
		codetb
	);
}
