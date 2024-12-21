CREATE TYPE "public"."housing_enum" AS ENUM('own', 'minha_casa_minha_vida', 'rent', 'given');--> statement-breakpoint
CREATE TYPE "public"."relation_enum" AS ENUM('maried', 'stable_union', 'affair', 'ex', 'none');--> statement-breakpoint
CREATE TYPE "public"."user_type_enum" AS ENUM('internal', 'external');--> statement-breakpoint
CREATE TYPE "public"."work_enum" AS ENUM('formal', 'informal', 'unemployed');--> statement-breakpoint
CREATE TABLE "address" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cep" char(9) NOT NULL,
	"street" varchar(100) NOT NULL,
	"neighborhood" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"uf" char(2) NOT NULL,
	"number" integer,
	"complement" text,
	"description" text,
	"crated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "help_kind" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "helps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"kind_id" uuid NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp DEFAULT now(),
	"resolved_at" timestamp DEFAULT now(),
	"rate" smallint
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "extra_data" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cpf" char(11) NOT NULL,
	"birthDate" date NOT NULL,
	"phone" varchar(13),
	"adultChildren" integer DEFAULT 0,
	"minorChildren" integer DEFAULT 0,
	"work" "work_enum" NOT NULL,
	"income" varchar(50) NOT NULL,
	"housing" "housing_enum" NOT NULL,
	"relation" "relation_enum" NOT NULL,
	"home" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"user_type" "user_type_enum" DEFAULT 'external',
	"created_at" timestamp DEFAULT now(),
	"last_updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "volunteer_kind" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "volunteers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(13) NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"kind_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "help_kind" ADD CONSTRAINT "help_kind_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "helps" ADD CONSTRAINT "helps_kind_id_help_kind_id_fk" FOREIGN KEY ("kind_id") REFERENCES "public"."help_kind"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "helps" ADD CONSTRAINT "helps_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extra_data" ADD CONSTRAINT "extra_data_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extra_data" ADD CONSTRAINT "extra_data_home_address_id_fk" FOREIGN KEY ("home") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_kind" ADD CONSTRAINT "volunteer_kind_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_kind_id_volunteer_kind_id_fk" FOREIGN KEY ("kind_id") REFERENCES "public"."volunteer_kind"("id") ON DELETE no action ON UPDATE no action;
