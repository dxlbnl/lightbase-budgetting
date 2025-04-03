<script lang='ts'>
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

    let maxPurchase = $derived(data?.budgets?.reduce((max: number, budget: number) => {
        const remaining = parseFloat(budget.remaining)
        return max > remaining ? max : remaining
    }, 0))
</script>


<h1>Lightbase budgets</h1>

{#if data?.member}
    <!-- Logged in -->
     <section>
        <p>Logged in as {data.member.name}</p>
        <form method='POST' action='?/logout'>
            <button>Log out</button>
        </form>
    </section>
    
    <!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

    <section>
        <h2>Budgets</h2>
        <ul>
            {#each data.budgets as budget }
                <li>Budget € {budget.remaining} (valid: {budget.validFrom} - {budget.validTo})</li>
            {:else}
                <li>Sadly there's no budget</li>
            {/each}
        </ul>
    </section>

    {#if maxPurchase > 0}
    <section>
        <form method='POST' action='?/purchase'>
            <h2>Register purchase</h2>

            <label>Amount: 
                <input required type='number' name='amount' min=0 max={maxPurchase} step=0.01/>
            </label>
            <label>Description:
                <input name='description' />
            </label>
            <button>submit</button>
        </form>

        {#if form?.type === 'purchase'}
            <p>{form?.message}</p>
        {/if}
    </section>
    {/if}


{:else}
    <!-- Logged out -->
    {#if form?.success}
        <p>login ok</p>
    {:else if form}
        <p>Failed</p>
    {/if}
    
    <section>
        <form method='POST' action='?/login'>
            <h2>Log in</h2>
            <input required name='name' />
            <button>submit</button>
        </form>
    </section>
{/if}

<style>
    section {
        max-width: 40ch;
    }
    form {
        display: grid;
        grid-auto-flow: row;
        gap: 1ch;

        & label {
            display: grid;
        }
        & input {
            margin-left: 4ch;
        }
    }
</style>