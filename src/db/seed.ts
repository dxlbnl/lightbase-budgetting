import { db } from ".";
import { type MemberInsert, type TeamInsert, type BudgetInsert, teams, members, budgets} from "./schema";


await db.delete(teams).execute()
await db.delete(members).execute()
await db.delete(budgets).execute()


const newTeam: TeamInsert = {
    name: 'hitchhikers'
}

const newMembers: MemberInsert[] = [
    { name: 'Zaphod', team: 'hitchhikers'},
    { name: 'Arthur', team: 'hitchhikers'},
    { name: 'Trillian', team: 'hitchhikers'},
]

const newBudgets: BudgetInsert[] = [
    { team: 'hitchhikers', amount: '100.00', validFrom: '2025-01-01', validTo: '2025-12-31' },
    { team: 'hitchhikers', amount: '400.00', validFrom: '2025-06-01', validTo: '2025-08-31' }
]

await db.insert(teams).values(newTeam)
await db.insert(members).values(newMembers)
await db.insert(budgets).values(newBudgets)