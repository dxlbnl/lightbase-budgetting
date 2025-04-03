import { beforeAll, describe, expect, it, vi } from 'vitest';
import { actions, type PurchaseForm } from './+page.server';
import { fail } from '@sveltejs/kit';

// Seed db
beforeAll(async () => {
	await import('../db/seed');
});

const mockCookies = {
	set: vi.fn(),
	delete: vi.fn(),
	get: vi.fn(() => null)
};

describe('login', () => {
	it('should set the cookie', async () => {
		const form = new FormData();
		form.append('name', 'arthur');

		const request = new Request('http://localhost', {
			method: 'POST',
			body: form
		});

		const result = await actions.login({ request, cookies: mockCookies });
		expect(result).toEqual({
			member: {
				name: 'Arthur',
				team: 'hitchhikers'
			},
			success: true
		});
		expect(mockCookies.set).toBeCalledWith('user', 'Arthur', {
			path: '/'
		});
	});

	it('should fail on wrong user', async () => {
		const form = new FormData();
		form.append('name', 'invalid');

		const request = new Request('http://localhost', {
			method: 'POST',
			body: form
		});

		const result = await actions.login({ request, cookies: mockCookies });
		expect(result).toEqual(
			fail(403, {
				success: false
			})
		);
	});
});

describe('purchase', () => {
	const getCookie = vi.fn(() => 'arthur');
	const mockCookies = {
		set: vi.fn(),
		delete: vi.fn(),
		get: getCookie
	};
	const purchaseRequest = (data: PurchaseForm) => {
		const form = new FormData();
		Object.entries(data).forEach(([key, value]) => form.append(key, value.toString()));

		return new Request('http://localhost', {
			method: 'POST',
			body: form
		});
	};
	it('should check the cookie', async () => {
		getCookie.mockImplementationOnce(() => 'invalid');

		const result = await actions.purchase({
			request: purchaseRequest({ amount: 0 }),
			cookies: mockCookies
		});

		expect(result).toEqual(
			fail(403, {
				error: 'unauthorized',
				type: 'purchase'
			})
		);
	});
	it('should fail on invalid form', async () => {
		const result = await actions.purchase({
			request: purchaseRequest({ amount: "testing" } as any as PurchaseForm),
			cookies: mockCookies
		});

		expect(result).toEqual(
			fail(400, {
				error: 'invalid form',
				type: 'purchase'
			})
		);
	});
	it('should fail on insufficient funds', async () => {
		const result = await actions.purchase({
			request: purchaseRequest({ amount: 101 }),
			cookies: mockCookies
		});

		expect(result).toEqual(
			fail(400, {
				error: 'insufficient funds',
				type: 'purchase'
			})
		);
	});
	it('should allow a valid purchase', async () => {
		const result = await actions.purchase({
			request: purchaseRequest({ amount: 100, description: 'vitest'}),
			cookies: mockCookies
		});

		expect(result).toEqual({
			type: 'purchase',
			message: 'Arthur purchased 100 for vitest'
		});
	});
});
