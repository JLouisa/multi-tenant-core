CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"applications_id" uuid NOT NULL,
	"permissions" text[] NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_applications_id_pk" PRIMARY KEY("name","applications_id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "roles_id_index" ON "roles" ("id");
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_applications_id_applications_id_fk" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
