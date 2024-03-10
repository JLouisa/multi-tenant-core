ALTER TABLE "applications" RENAME COLUMN "create_at" TO "created_at";
ALTER TABLE "roles" RENAME COLUMN "create_at" TO "created_at";
ALTER TABLE "users" RENAME COLUMN "create_at" TO "name";
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(256);
ALTER TABLE "users" ALTER COLUMN "name" DROP DEFAULT;
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;