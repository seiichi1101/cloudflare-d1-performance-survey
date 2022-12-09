select sqlite_version();

SELECT m.name as tableName, 
       p.name as columnName
FROM sqlite_master m
left outer join pragma_table_info((m.name)) p
     on m.name <> p.name
order by tableName, columnName
;
