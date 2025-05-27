export function parseRight(userData: any, data2: any, data3: any): boolean {
	if (userData?.accessTo?.[data3]) return !!(data2 & userData.accessTo[data3].permission);

	return false;
}
