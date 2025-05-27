export class WMSLinkBuilder {
	private geoserverUrl = process.env.GEOSERVER_URL;
	private workspace = process.env.GEOSERVER_WORKSPACE;

	private link: string = this.geoserverUrl + '/wms?service=WMS';

	public getURLImage(
		layerName: string,
		minx: number,
		miny: number,
		maxx: number,
		maxy: number,
		style?: string,
	): string {
		return new WMSLinkBuilder()
			.setVersion()
			.setRequest()
			.setLayers(layerName)
			.setBbox(minx, miny, maxx, maxy)
			.setStyles(style)
			.setWidth(200)
			.setHeight(200)
			.setFormat('image/png')
			.setTransparent(true)
			.build();
	}

	public setVersion(version: string = '1.2.0'): WMSLinkBuilder {
		this.link += `&version=${version}`;
		return this;
	}

	public setRequest(request: string = 'GetMap'): WMSLinkBuilder {
		this.link += `&request=${request}`;
		return this;
	}

	public setLayers(layers: string): WMSLinkBuilder {
		this.link += `&layers=${this.workspace}:${layers}`;
		return this;
	}

	public setBbox(minx: number, miny: number, maxx: number, maxy: number): WMSLinkBuilder {
		this.link += `&bbox=${minx},${miny},${maxx},${maxy}`;
		return this;
	}

	public setWidth(width: number = 200): WMSLinkBuilder {
		this.link += `&width=${width}`;
		return this;
	}

	public setHeight(height: number = 200): WMSLinkBuilder {
		this.link += `&height=${height}`;
		return this;
	}

	public setFormat(format: string = 'image/png'): WMSLinkBuilder {
		this.link += `&format=${format}`;
		return this;
	}

	public setTransparent(transparent: boolean = true): WMSLinkBuilder {
		this.link += `&transparent=${transparent}`;
		return this;
	}

	public setStyles(styles?: string): WMSLinkBuilder {
		if (!styles) return this;
		this.link += `&styles=${styles}`;
		return this;
	}

	public build(): string {
		return encodeURI(this.link);
	}
}
