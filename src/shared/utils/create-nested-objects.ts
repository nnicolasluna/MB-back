export function createNestedObject(fields: string, value: any) {
	const obj = {};
	const keys = fields.split('.');
	const lastKey = keys.pop();

	keys.reduce((acc, key) => {
		if (!acc[key]) {
			acc[key] = {};
		}
		return acc[key];
	}, obj)[lastKey] = value;

	return obj;
}
