CREATE TABLE "budgets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "budgets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"team" varchar NOT NULL,
	"amount" numeric(2) NOT NULL,
	"validFrom" date NOT NULL,
	"validTo" date NOT NULL,
	CONSTRAINT "valid_check" CHECK ("budgets"."validFrom" < "budgets"."validTo"),
	CONSTRAINT "amount_check" CHECK ("budgets"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "members" (
	"name" varchar PRIMARY KEY NOT NULL,
	"team" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "purchases_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"member" varchar NOT NULL,
	"budget" integer NOT NULL,
	"amount" numeric(2) NOT NULL,
	"date" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"name" varchar PRIMARY KEY NOT NULL
);
