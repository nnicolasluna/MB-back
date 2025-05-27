import { genSaltSync, hashSync } from 'bcryptjs';

export function hashText(text: string, rounds: number = null): string {
	const saltRounds = genSaltSync(10);

	if (rounds) return hashSync(text, rounds);

	return hashSync(text, saltRounds);
}
