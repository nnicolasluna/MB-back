export async function streamToString(readableStream: ReadableStream) {
	const reader = readableStream.getReader();
	const decoder = new TextDecoder('utf-8');
	let result = '';
	let done: boolean, value: any;

	while ((({ done, value } = await reader.read()), !done)) {
		result += decoder.decode(value, { stream: true });
	}

	result += decoder.decode();

	return result;
}
