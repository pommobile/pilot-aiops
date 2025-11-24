https://www.postgresql.org/download/linux/redhat/

vi /var/lib/pgsql/17/data/postgresql.conf
localhost -> *

vi /var/lib/pgsql/17/data/pg_hba.conf 
host    people    people    9.66.241.120/32    md5
host    coverages    coverages    x/32    md5
host    contracts    contracts    y/32    md5

https://www.linuxtricks.fr/wiki/red-hat-alma-linux-installer-et-configurer-un-serveur-de-base-de-donnees-postgresql-8-et-9

su -lc 'psql -p 5432' postgres

CREATE USER people WITH PASSWORD 'people';
CREATE DATABASE people OWNER 'people';
GRANT ALL PRIVILEGES ON DATABASE people TO people;

CREATE USER coverages WITH PASSWORD 'coverages';
CREATE DATABASE coverages OWNER 'coverages';
GRANT ALL PRIVILEGES ON DATABASE coverages TO coverages;

CREATE USER contracts WITH PASSWORD 'contracts';
CREATE DATABASE contracts OWNER 'contracts';
GRANT ALL PRIVILEGES ON DATABASE contracts TO contracts;