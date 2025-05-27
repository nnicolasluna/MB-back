import { XMLParser } from 'fast-xml-parser';

// Return { propName: color } object from SLD XML
export async function getColorsFromSLD(xmlString: string): Promise<any> {
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: '',
		parseAttributeValue: true,
	});

	const jsonObj = parser.parse(xmlString);
	const colors = {};

	const rules = jsonObj.StyledLayerDescriptor.NamedLayer.UserStyle['se:FeatureTypeStyle']['se:Rule'];

	rules.forEach((rule: any) => {
		const filter = rule['ogc:Filter']['ogc:PropertyIsEqualTo'];
		const literal = filter['ogc:Literal'];
		const fill = rule['se:PolygonSymbolizer']['se:Fill']['se:SvgParameter']['#text'];

		colors[literal] = fill;
	});

	return colors;
}
