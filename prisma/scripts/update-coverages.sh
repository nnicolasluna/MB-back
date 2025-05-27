#!/bin/bash

print_green() {
	echo -e "\033[0;32m$1\033[0m"
}

print_red() {
	echo -e "\033[0;31m$1\033[0m"
}

print_blue() {
	echo -e "\033[0;34m$1\033[0m"
}

handle_error() {
	print_red "$1"
	exit 1
}

BASE_PATH="./prisma/scripts/data"

GEOSERVER_URL=$(grep "^GEOSERVER_URL=" .env | cut -d '=' -f 2- | tr -d '"')
GEOSERVER_WORKSPACE=$(grep "^GEOSERVER_WORKSPACE=" .env | cut -d '=' -f 2- | tr -d '"')
GEOSERVER_USERNAME=$(grep "^GEOSERVER_USERNAME=" .env | cut -d '=' -f 2- | tr -d '"')
GEOSERVER_PASSWORD=$(grep "^GEOSERVER_PASSWORD=" .env | cut -d '=' -f 2- | tr -d '"')
GEOSERVER_DATASTORE=$(grep "^DATABASE_NAME=" .env | cut -d '=' -f 2- | tr -d '"')

SLD_PATH="$BASE_PATH/slds"

print_blue "Cargando estilos SLD a GeoServer..."

shopt -s nullglob
sld_files=("$SLD_PATH"/*.sld)

if [ "${#sld_files[@]}" -gt 0 ]; then
	for sld_file in "${sld_files[@]}"; do
		sld_name=$(basename "$sld_file" .sld)

		response=$(curl -u "$GEOSERVER_USERNAME:$GEOSERVER_PASSWORD" -s -o /dev/null -w "%{http_code}" "$GEOSERVER_URL/rest/workspaces/$GEOSERVER_WORKSPACE/styles/$sld_name.sld")

		if [ "$response" -eq 200 ]; then
			print_blue "El estilo $sld_name ya existe en GeoServer. Reemplazando el estilo..."
			curl -u "$GEOSERVER_USERNAME:$GEOSERVER_PASSWORD" -X PUT -H "Content-Type: application/vnd.ogc.se+xml" \
				--data-binary "@$sld_file" \
				"$GEOSERVER_URL/rest/workspaces/$GEOSERVER_WORKSPACE/styles/$sld_name" || handle_error "Error reemplazando el estilo $sld_name."
			print_green "Estilo $sld_name reemplazado con éxito."
		else
			print_blue "Subiendo el estilo $sld_name a GeoServer."
			curl -u "$GEOSERVER_USERNAME:$GEOSERVER_PASSWORD" -X POST -H "Content-Type: application/vnd.ogc.se+xml" \
				--data-binary "@$sld_file" \
				"$GEOSERVER_URL/rest/workspaces/$GEOSERVER_WORKSPACE/styles?name=$sld_name" || handle_error "Error subiendo el estilo $sld_name."
			print_green "Estilo $sld_name subido con éxito."
		fi
	done
fi

SHAPE_FILE_BASE="$BASE_PATH/coverages"

DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f 2- | tr -d '"')
DATABASE_SCHEMA=$(grep "^DATABASE_CARTOGRAPHIC_SCHEMA=" .env | cut -d '=' -f 2- | tr -d '"')
DATABASE_SCHEMA=${DATABASE_SCHEMA:-"cartographic"}

for dir in "$SHAPE_FILE_BASE"/*; do
	if [ -d "$dir" ]; then
		LAYER_NAME=$(basename "$dir")

		echo "Procesando la capa $LAYER_NAME..."

		layer_exists=$(curl -u "$GEOSERVER_USERNAME:$GEOSERVER_PASSWORD" -s -o /dev/null -w "%{http_code}" "$GEOSERVER_URL/rest/workspaces/$GEOSERVER_WORKSPACE/datastores/$GEOSERVER_DATASTORE/featuretypes/$LAYER_NAME")
		echo "Layer exists: $layer_exists"

		if [ "$layer_exists" -eq 200 ]; then
			print_blue "Eliminando la capa existente $LAYER_NAME en GeoServer..."
			curl -u "$GEOSERVER_USERNAME:$GEOSERVER_PASSWORD" -X DELETE "$GEOSERVER_URL/rest/layers/$LAYER_NAME" || handle_error "Error eliminando la capa $LAYER_NAME."
			curl -u "$GEOSERVER_USERNAME:$GEOSERVER_PASSWORD" -X DELETE "$GEOSERVER_URL/rest/workspaces/$GEOSERVER_WORKSPACE/datastores/$GEOSERVER_DATASTORE/featuretypes/$LAYER_NAME" || handle_error "Error eliminando el tipo de feature $LAYER_NAME."
			print_green "Capa y tipo de feature $LAYER_NAME eliminados con éxito."
		fi

		echo "Convirtiendo shapefile a SQL..."
		SHAPE_FILE="$dir/$LAYER_NAME.shp"
		error_message=$(shp2pgsql -d -s 4326 "$SHAPE_FILE" "$DATABASE_SCHEMA.$LAYER_NAME" -I | psql -b "$DATABASE_URL" - 2>&1 1>/dev/null)

		print_green "Datos del shapefile cargados en PostgreSQL."

		print_blue "Creando la capa $LAYER_NAME en GeoServer..."
		curl -u "$GEOSERVER_USERNAME:$GEOSERVER_PASSWORD" -X POST -H "Content-Type: application/json" \
			-d "{\"featureType\": {\"name\": \"$LAYER_NAME\", \"nativeName\": \"$LAYER_NAME\", \"namespace\": {\"name\": \"$GEOSERVER_WORKSPACE\"}}}" \
			"$GEOSERVER_URL/rest/workspaces/$GEOSERVER_WORKSPACE/datastores/$GEOSERVER_DATASTORE/featuretypes" || {
			echo "Error creando la capa $LAYER_NAME en GeoServer."
			exit 1
		}
		print_green "Capa $LAYER_NAME creada exitosamente en GeoServer."
	fi
done

print_green "Proceso completado."
