import { relations, sql } from "drizzle-orm";
import { check, date, integer, numeric, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";


export const teams = pgTable('teams', {
    name: varchar().primaryKey()
})
export const teamsRelations = relations(teams, ({ many }) => ({
    users: many(members)
}))
export const teamInsertSchema = createInsertSchema(teams)
export type TeamInsert = z.infer<typeof teamInsertSchema>

export const members = pgTable('members', {
    name: varchar('').primaryKey(),
    team: varchar('').notNull()
})
export const membersRelations = relations(members, ({ one }) => ({
    team: one(teams, {
        fields: [members.team],
        references: [teams.name]
    }) 
}))
export const memberInsertSchema = createInsertSchema(members)
export type MemberInsert = z.infer<typeof memberInsertSchema>

export const budgets = pgTable('budgets', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    team: varchar().notNull(),
    amount: numeric({ precision: 5, scale: 2 }).notNull(),
    validFrom: date().notNull(),
    validTo: date().notNull(),
}, (table) => [
    check('valid_period', sql`${table.validFrom} < ${table.validTo}`),
    check('amount_positive', sql`${table.amount} > 0`),
])
export const budgetsRelations = relations(budgets, ({ one, many }) => ({
    team: one(teams, {
        fields: [budgets.team],
        references: [teams.name]
    }),
    purchases: many(purchases)
 }))
 export const budgetInsertSchema = createInsertSchema(budgets)
 export type BudgetInsert = z.infer<typeof budgetInsertSchema>

export const purchases = pgTable('purchases', { 
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    member: varchar().notNull(),
    budget: integer().notNull(),
    amount: numeric({ precision: 5, scale: 2 }).notNull(),
    date: date().notNull().defaultNow(),
    description: varchar(),
}, (table) => [
    check('amount_positive', sql`${table.amount} > 0`)
])
export const purchasesRelations = relations(purchases, ({ one }) => ({
    team: one(members, {
        fields: [purchases.member],
        references: [members.name]
    }),
    budget: one(budgets, {
        fields: [purchases.budget],
        references: [budgets.id],
    })
}))
export const purchaseInsertSchema = createInsertSchema(purchases)
export type PurchaseInsert = z.infer<typeof purchaseInsertSchema>
