ALTER TABLE "Restaurant" ADD COLUMN "fts" tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||      -- Prioridad Alta
  setweight(to_tsvector('spanish', coalesce(description, '')), 'B') || -- Prioridad Media
  setweight(to_tsvector('spanish', coalesce(address, '')), 'D')        -- Prioridad Baja
) STORED;

-- CreateIndex
CREATE INDEX "Restaurant_fts_idx" ON "Restaurant" USING GIN ("fts");


