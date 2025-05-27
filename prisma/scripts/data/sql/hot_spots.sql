CREATE SCHEMA IF NOT EXISTS hot_spots;
CREATE OR REPLACE FUNCTION get_hot_spots(
    start_date DATE,
    end_date DATE,
    satellites TEXT[]
)
RETURNS JSONB AS
$$
DECLARE
    sql_query TEXT := 'WITH combined_data AS (';
    combined_data JSONB;
    d DATE;
    satellite TEXT;
    first_table BOOLEAN := TRUE;
    common_columns TEXT := 'gid, latitude, longitude, geom, mun, prov, aps, tcos, ramsar, acq_date, acq_time';
BEGIN
    FOREACH satellite IN ARRAY satellites LOOP
        FOR d IN SELECT generate_series(start_date, end_date, '1 day')::date LOOP
            IF EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'hot_spots'
                AND table_name = format('%I_%s', satellite, to_char(d, 'DD_MM_YYYY'))
            ) THEN
                IF first_table THEN
                    sql_query := sql_query || format('SELECT %s, ''%I_%s'' AS storage, ''%I'' as satelite FROM "hot_spots"."%I_%s" ',
                        common_columns,
                        satellite, to_char(d, 'DD_MM_YYYY'),
                        satellite,
                        satellite, to_char(d, 'DD_MM_YYYY'));
                    first_table := FALSE;
                ELSE
                    sql_query := sql_query || format('UNION ALL SELECT %s, ''%I_%s''  AS storage, ''%I'' as satelite FROM "hot_spots"."%I_%s" ',
                        common_columns,
                        satellite, to_char(d, 'DD_MM_YYYY'),
                        satellite,
                        satellite, to_char(d, 'DD_MM_YYYY'));
                END IF;
            END IF;
        END LOOP;
    END LOOP;

    IF first_table THEN
        RETURN jsonb_build_object('error', 'No se encontraron tablas para las fechas proporcionadas.');
    END IF;

    sql_query := sql_query || ') ';

    sql_query := sql_query || '
    SELECT jsonb_build_object(
        ''type'', ''FeatureCollection'',
        ''features'', jsonb_agg(
            jsonb_build_object(
                ''type'', ''Feature'',
                ''geometry'', ST_AsGeoJSON(geom)::jsonb,
                ''properties'', to_jsonb(t) - ''geom'' || jsonb_build_object(''storage'', storage)
            )
        )
    ) AS geojson
    FROM combined_data AS t;';

    RAISE NOTICE 'SQL Query: %', sql_query;

    EXECUTE sql_query INTO combined_data;
    RETURN combined_data;

EXCEPTION
    WHEN undefined_table THEN
        RETURN jsonb_build_object('error', 'Una o más tablas no existen en el rango de fechas proporcionado.');
    WHEN OTHERS THEN
        RETURN jsonb_build_object('error', 'Error: ' || SQLERRM || ' - Query: ' || sql_query);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION select_shp_hot_spots(
    start_date DATE,
    end_date DATE,
    satellites TEXT[]
)
RETURNS TEXT as
$$
DECLARE
    sql_query TEXT := 'WITH combined_data AS (';
    first_table BOOLEAN := TRUE;
    common_columns TEXT := 'gid, latitude, longitude, geom, mun, prov, aps, tcos, ramsar, acq_date, acq_time';
    satellite TEXT;
    d DATE;
BEGIN
    FOREACH satellite IN ARRAY satellites LOOP
        FOR d IN SELECT generate_series(start_date, end_date, '1 day')::date LOOP
            IF EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'hot_spots'
                AND table_name = format('%I_%s', satellite, to_char(d, 'DD_MM_YYYY'))
            ) THEN
                IF first_table THEN
                    sql_query := sql_query || format('SELECT %s, ''%I_%s'' AS storage, ''%I'' as satelite FROM "hot_spots"."%I_%s" ',
                        common_columns,
                        satellite, to_char(d, 'DD_MM_YYYY'),
                        satellite,
                        satellite, to_char(d, 'DD_MM_YYYY'));
                    first_table := FALSE;
                ELSE
                    sql_query := sql_query || format(' UNION ALL SELECT %s, ''%I_%s'' AS storage, ''%I'' as satelite FROM "hot_spots"."%I_%s" ',
                        common_columns,
                        satellite, to_char(d, 'DD_MM_YYYY'),
                        satellite,
                        satellite, to_char(d, 'DD_MM_YYYY'));
                END IF;
            END IF;
        END LOOP;
    END LOOP;

    IF first_table THEN
        RAISE NOTICE 'No se encontraron tablas para las fechas y satélites proporcionados.';
        RETURN '';
    END IF;

    sql_query := sql_query || ') SELECT * FROM combined_data;';

    RAISE NOTICE 'SQL Query: %', sql_query;

    RETURN sql_query;
END;
$$ LANGUAGE plpgsql;
