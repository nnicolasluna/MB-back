#!/bin/bash

DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f 2- | tr -d '"')

if [ -z "$DATABASE_URL" ]; then
	echo "Connection string is not defined in .env file"
	exit 1
fi

echo "Loading data carto default tables into cartographic schema..."

psql "$DATABASE_URL" -f ./prisma/scripts/data/maps/streets.sql >/dev/null
echo "Streets data loaded"
psql "$DATABASE_URL" -f ./prisma/scripts/data/maps/department.sql >/dev/null
echo "Department data loaded"
psql "$DATABASE_URL" -f ./prisma/scripts/data/maps/province.sql >/dev/null
echo "Province data loaded"
psql "$DATABASE_URL" -f ./prisma/scripts/data/maps/municipality.sql >/dev/null
echo "Municipality data loaded"
