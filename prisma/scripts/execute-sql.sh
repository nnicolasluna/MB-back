#!/bin/bash

DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f 2- | tr -d '"')

if [ -z "$DATABASE_URL" ]; then
	echo "Connection string is not defined in .env file"
	exit 1
fi

BASE_PATH="./prisma/scripts/data"

SQL_PATH="$BASE_PATH/sql"

for sql_file in "$SQL_PATH"/*.sql; do
	if [ -f "$sql_file" ]; then
		echo "Executing SQL file: $sql_file"
		psql "$DATABASE_URL" -f "$sql_file" >/dev/null
		if [ $? -ne 0 ]; then
			echo "Error executing SQL file: $sql_file"
			exit 1
		fi
		echo "SQL file executed successfully: $sql_file"
	else
		echo "No SQL files found in $SQL_PATH"
	fi
done
