export class GeoserverLinkBuilder {
	private geoserverUrl = process.env.GEOSERVER_URL;
	private workspace = process.env.GEOSERVER_WORKSPACE;
	private storeName = process.env.DATABASE_NAME;

	private link: string = this.geoserverUrl;

	public getPublishLayerLink() {
		return this.setRest().setWorkspaces().setWorkspace().setDatastores().setDatastore().setFeaturetypes().build();
	}

	public getDeleteLayerLink(layer: string) {
		return this.setRest().setWorkspaces().setWorkspace().setLayers().setLayer(layer).build();
	}

	public setRest() {
		this.link += '/rest';
		return this;
	}

	public setWorkspaces() {
		this.link += '/workspaces';
		return this;
	}

	public setWorkspace(workspace?: string) {
		this.link += `/${workspace ?? this.workspace}`;
		return this;
	}

	public setDatastores() {
		this.link += '/datastores';
		return this;
	}

	public setDatastore(datastore?: string) {
		this.link += `/${datastore ?? this.storeName}`;
		return this;
	}

	public setFeaturetypes() {
		this.link += '/featuretypes';
		return this;
	}

	public setLayers() {
		this.link += '/layers';
		return this;
	}

	public setLayer(layer: string) {
		this.link += `/${layer}`;
		return this;
	}

	public setStyles() {
		this.link += '/styles';
		return this;
	}

	public setStyle(style: string) {
		this.link += `/${style}`;
		return this;
	}

	public setParams(key: string, value: string) {
		if (!this.link.includes('?')) this.link += '?';
		this.link += `${key}=${value}`;
		return this;
	}

	public build() {
		return this.link;
	}
}
