CREATE TABLE "study_documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"origin" text NOT NULL,
	"theme" text NOT NULL,
	"closed" boolean DEFAULT false NOT NULL,
	"version" integer NOT NULL,
	"object_key" text NOT NULL,
	"digest" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_revisions" (
	"document_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"name" text NOT NULL,
	"object_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "study_revisions_document_id_version_pk" PRIMARY KEY("document_id","version")
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"finished_at" timestamp with time zone NOT NULL,
	"duration_ms" integer NOT NULL,
	"technique" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "study_revisions" ADD CONSTRAINT "study_revisions_document_id_study_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."study_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "study_documents_owner" ON "study_documents" USING btree ("owner_id","id");--> statement-breakpoint
CREATE INDEX "study_sessions_owner" ON "study_sessions" USING btree ("owner_id","finished_at","id");