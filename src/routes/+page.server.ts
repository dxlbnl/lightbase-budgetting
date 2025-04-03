import { eq, gt, lt, sql, and } from 'drizzle-orm';
import { db } from '../db';
import { budgets as budgetsTable, members as membersTable, purchases } from '../db/schema';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const getUser = (name: string) =>
	db.query.members.findFirst({ where: eq(sql`lower(${membersTable.name})`, name.toLowerCase()) });

const availableBudgets = db.$with('availableBudgets').as(
	db
		.select({
			id: budgetsTable.id,
			team: budgetsTable.team,
			validFrom: budgetsTable.validFrom,
			validTo: budgetsTable.validTo,
			spent: sql<number>`COALESCE(SUM(${purchases.amount}), 0)`.as('spent'),
			remaining: sql<number>`${budgetsTable.amount} - COALESCE(SUM(${purchases.amount}), 0)`.as(
				'remaining'
			)
		})
		.from(budgetsTable)
    .where(and(
      gt(sql`NOW()`, budgetsTable.validFrom),
      lt(sql`NOW()`, budgetsTable.validTo)
    ))
		.leftJoin(purchases, eq(budgetsTable.id, purchases.budget))
		.groupBy(budgetsTable.id, budgetsTable.validFrom, budgetsTable.validTo, budgetsTable.amount, budgetsTable.team)
		.orderBy(budgetsTable.validTo)
);

const getValidBudgetsFor = (team: string) =>
	db.with(availableBudgets).select().from(availableBudgets).where(and(eq(availableBudgets.team, team), gt(availableBudgets.remaining, 0)))

export const load: PageServerLoad = async ({ cookies }) => {
	const user = cookies.get('user');

	if (!user) return;

	// "Validate" cookie
	const member = await getUser(user);
	if (!member) return;

	// Query budgets
	const budgets = await getValidBudgetsFor(member.team);

	return { member, budgets };
};

const loginForm = z.object({
	name: z.string()
});

const purchaseForm = z.object({
	amount: z.string().transform((amount) => parseFloat(amount)),
	description: z.string()
});

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const { error, data } = loginForm.safeParse(Object.fromEntries(formData.entries()));

		if (error) {
			console.error('Error parsing form', error);
			return fail(400, { success: false });
		}
		const member = await getUser(data.name);

		// Check user, should do password validation here too
		if (!member) {
			return fail(403, { success: false });
		}

		cookies.set('user', member.name, {
			path: '/'
		});
		return {
			success: true,
			member
		};
	},
	logout: ({ cookies }) => {
		cookies.delete('user', { path: '/' });
		return;
	},
	purchase: async ({ request, cookies }) => {
		const user = cookies.get('user');

		if (!user) return fail(403, { type: 'purchase', error: 'unauthorized' });

		// "Validate" cookie
		const member = await getUser(user);
		if (!member) return fail(403, { type: 'purchase', error: 'unauthorized' });

		const formData = await request.formData();
		const { error, data } = purchaseForm.safeParse(Object.fromEntries(formData.entries()));

		if (error) {
			console.error('Error parsing form', error);
			return fail(400, { type: 'purchase', error: 'invalid form' });
		}

		// Budgets are ordered by expiry, so the optimal budget would be the first fitting the purchase.
		const budgets = await getValidBudgetsFor(member.team);
		const budget = budgets.find((budget) => budget.remaining >= data.amount);

		if (!budget) return fail(400, { type: 'purchase', error: 'insufficient funds' });

		await db.insert(purchases).values({
			member: member.name,
			budget: budget.id,
			amount: data.amount.toFixed(2),
			description: data.description
		});
		const message = `${member.name} purchased ${data.amount} for ${data.description || 'something'}`;
		console.log(message);

		return {
			type: 'purchase',
			message
		};
	}
} satisfies Actions;
