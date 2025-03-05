DROP TABLE IF EXISTS "public"."products";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.
DROP SEQUENCE IF EXISTS products_id_seq;

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS products_id_seq;

-- Table Definition
CREATE TABLE "public"."products" (
    "id" int4 NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    "name" varchar,
    "description" varchar,
    "price" int8
);

INSERT INTO "public"."products" ("id", "name", "description", "price") VALUES
(1, 'cup', 'it''s a cup', 100);
INSERT INTO "public"."products" ("id", "name", "description", "price") VALUES
(2, 'cake', 'it''s cake', 200);
INSERT INTO "public"."products" ("id", "name", "description", "price") VALUES
(3, 'anything', 'it is what it is', 1000);
INSERT INTO "public"."products" ("id", "name", "description", "price") VALUES
(5, 'anything', 'it is what it is', 1000),
(6, 'anything', 'it is what it is', 1000);