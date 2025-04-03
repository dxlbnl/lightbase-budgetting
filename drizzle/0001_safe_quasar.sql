ALTER TABLE "budgets" DROP CONSTRAINT "valid_check";--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "amount_check";--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "amount" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "valid_period" CHECK ("budgets"."validFrom" < "budgets"."validTo");--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "amount_positive" CHECK ("budgets"."amount" > 0);--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "amount_positive" CHECK ("purchases"."amount" > 0);