CREATE OR REPLACE FUNCTION process_monitoring_table(table_name TEXT, cols TEXT)
RETURNS TEXT AS $$
DECLARE
    cols_no_prefix TEXT;
    output_table TEXT;
    idx_name TEXT;
BEGIN
    cols_no_prefix := REPLACE(cols, 't.', '');
    output_table := table_name || '_processed';

    EXECUTE format('DROP TABLE IF EXISTS cartographic.%I', output_table);

    EXECUTE format('
        CREATE TEMP TABLE tmp_valid AS
        SELECT
            %s,
            CASE WHEN ST_IsValid(t.geom) THEN t.geom ELSE ST_MakeValid(t.geom) END AS geom
        FROM cartographic.%I t',
        cols, table_name);

    idx_name := 'idx_tmp_valid_geom';
    EXECUTE format('CREATE INDEX %I ON tmp_valid USING GIST(geom)', idx_name);
    ANALYZE tmp_valid;

    -- Municipios
    EXECUTE format('
        CREATE UNLOGGED TABLE tmp_mun AS
        SELECT
            %s,
            mun.prov,
            mun.mun,
            NULL::text AS aps,
            NULL::text AS tcos,
						NULL::text AS ramsar,
            ST_Area(ST_Intersection(t.geom, mun.geom), true) AS sup,
            ST_Intersection(t.geom, mun.geom) AS geom
        FROM
            tmp_valid t
        JOIN
            cartographic.beni_municipios mun ON ST_Intersects(t.geom, mun.geom)',
        cols);

    EXECUTE 'CREATE INDEX idx_tmp_mun_geom ON tmp_mun USING GIST(geom)';
    ANALYZE tmp_mun;

    -- Sitios Ramsar
    EXECUTE format('
        CREATE UNLOGGED TABLE tmp_ram AS
        SELECT
            %s,
            NULL::text AS prov,
            NULL::text AS mun,
            NULL::text AS aps,
            NULL::text AS tcos,
						ram.nom_ramsar AS ramsar,
            ST_Area(ST_Intersection(t.geom, ram.geom), true) AS sup,
            ST_Intersection(t.geom, ram.geom) AS geom
        FROM
            tmp_valid t
        JOIN
            cartographic.sitios_ramsar ram ON ST_Intersects(t.geom, ram.geom)',
        cols);

    EXECUTE 'CREATE INDEX idx_tmp_ram_geom ON tmp_ram USING GIST(geom)';
    ANALYZE tmp_ram;

    -- Áreas protegidas
    EXECUTE format('
        CREATE UNLOGGED TABLE tmp_aps AS
        SELECT
            %s,
            NULL::text AS prov,
            NULL::text AS mun,
            aps.nom_aps1 AS aps,
            NULL::text AS tcos,
						NULL::text AS ramsar,
            ST_Area(ST_Intersection(t.geom, aps.geom), true) AS sup,
            ST_Intersection(t.geom, aps.geom) AS geom
        FROM
            tmp_valid t
        JOIN
            cartographic.aps_moxos aps ON ST_Intersects(t.geom, aps.geom)',
        cols);

    -- TCOs
    EXECUTE format('
        CREATE UNLOGGED TABLE tmp_tcos AS
        SELECT
            %s,
            NULL::text AS prov,
            NULL::text AS mun,
            NULL::text AS aps,
            tco.nom_tcos AS tcos,
						NULL::text AS ramsar,
            ST_Area(ST_Intersection(t.geom, tco.geom), true) AS sup,
            ST_Intersection(t.geom, tco.geom) AS geom
        FROM
            tmp_valid t
        JOIN
            cartographic.tcos_moxos tco ON ST_Intersects(t.geom, tco.geom)',
        cols);

    -- Manejar colecciones
    EXECUTE format('
        CREATE UNLOGGED TABLE tmp_mun_processed AS
        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            sup,
            geom
        FROM
            tmp_mun t
        WHERE
            ST_GeometryType(t.geom) NOT IN (''ST_GeometryCollection'')

        UNION ALL

        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            ST_Area(d.geom, true) AS sup,
            d.geom
        FROM
            tmp_mun t,
            LATERAL ST_Dump(t.geom) AS d
        WHERE
            ST_GeometryType(t.geom) = ''ST_GeometryCollection''
            AND ST_GeometryType(d.geom) NOT IN (''ST_LineString'', ''ST_MultiLineString'')',
        cols, cols);

    EXECUTE format('
        CREATE UNLOGGED TABLE tmp_aps_processed AS
        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            sup,
            geom
        FROM
            tmp_aps t
        WHERE
            ST_GeometryType(t.geom) NOT IN (''ST_GeometryCollection'')

        UNION ALL

        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            ST_Area(d.geom, true) AS sup,
            d.geom
        FROM
            tmp_aps t,
            LATERAL ST_Dump(t.geom) AS d
        WHERE
            ST_GeometryType(t.geom) = ''ST_GeometryCollection''
            AND ST_GeometryType(d.geom) NOT IN (''ST_LineString'', ''ST_MultiLineString'')',
        cols_no_prefix, cols_no_prefix);

    EXECUTE format('
        CREATE UNLOGGED TABLE tmp_tcos_processed AS
        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            sup,
            geom
        FROM
            tmp_tcos t
        WHERE
            ST_GeometryType(t.geom) NOT IN (''ST_GeometryCollection'')

        UNION ALL

        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            ST_Area(d.geom, true) AS sup,
            d.geom
        FROM
            tmp_tcos t,
            LATERAL ST_Dump(t.geom) AS d
        WHERE
            ST_GeometryType(t.geom) = ''ST_GeometryCollection''
            AND ST_GeometryType(d.geom) NOT IN (''ST_LineString'', ''ST_MultiLineString'')',
        cols_no_prefix, cols_no_prefix);

	EXECUTE format('
        CREATE UNLOGGED TABLE tmp_ram_processed AS
        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            sup,
            geom
        FROM
            tmp_ram t
        WHERE
            ST_GeometryType(t.geom) NOT IN (''ST_GeometryCollection'')

        UNION ALL

        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            ST_Area(d.geom, true) AS sup,
            d.geom
        FROM
            tmp_ram t,
            LATERAL ST_Dump(t.geom) AS d
        WHERE
            ST_GeometryType(t.geom) = ''ST_GeometryCollection''
            AND ST_GeometryType(d.geom) NOT IN (''ST_LineString'', ''ST_MultiLineString'')',
        cols_no_prefix, cols_no_prefix);

    EXECUTE format('
        CREATE TABLE cartographic.%I AS
        SELECT
            %s,
            mun,
            prov,
            aps,
            tcos,
						ramsar,
            SUM(sup) / 10000 AS sup,
            ST_Union(geom) AS geom
        FROM (
            SELECT * FROM tmp_mun_processed
            UNION ALL
            SELECT * FROM tmp_aps_processed
            UNION ALL
            SELECT * FROM tmp_tcos_processed
						UNION ALL
            SELECT * FROM tmp_ram_processed
        ) combined
        GROUP BY
            %s, mun, prov, aps, tcos, ramsar',
        output_table, cols_no_prefix, cols_no_prefix);

    EXECUTE format('
        CREATE INDEX idx_%I_geom ON cartographic.%I USING GIST(geom)',
        output_table, output_table);

    EXECUTE format('ANALYZE cartographic.%I', output_table);

    EXECUTE format('DROP TABLE IF EXISTS cartographic.%I', table_name);
    EXECUTE format('ALTER TABLE cartographic.%I RENAME TO %I', output_table, table_name);

    DROP TABLE IF EXISTS tmp_valid;
    DROP TABLE IF EXISTS tmp_mun;
    DROP TABLE IF EXISTS tmp_aps;
    DROP TABLE IF EXISTS tmp_tcos;
	DROP TABLE IF EXISTS tmp_ram;
    DROP TABLE IF EXISTS tmp_mun_processed;
    DROP TABLE IF EXISTS tmp_aps_processed;
    DROP TABLE IF EXISTS tmp_tcos_processed;
	DROP TABLE IF EXISTS tmp_ram_processed;

    RETURN table_name;

END;
$$ LANGUAGE plpgsql;
