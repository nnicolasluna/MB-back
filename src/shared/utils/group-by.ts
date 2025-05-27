export function groupBy<T>(array: T[], key: string): Record<string, T[]> {
	return array.reduce(
		(acc, item) => {
			const group = item[key];
			if (!acc[group]) acc[group] = [];
			acc[group].push(item);
			return acc;
		},
		{} as Record<string, T[]>,
	);
}
