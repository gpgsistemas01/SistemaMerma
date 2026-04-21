ALTER TABLE "Supplier"
ADD COLUMN "codeNumber" INTEGER NOT NULL DEFAULT 0;

INSERT INTO "ReferenceNumberCounter" ("id", "prefix", "counter")
SELECT gen_random_uuid(), 'PRO', 0
WHERE NOT EXISTS (
    SELECT 1 FROM "ReferenceNumberCounter" WHERE "prefix" = 'PRO'
);
