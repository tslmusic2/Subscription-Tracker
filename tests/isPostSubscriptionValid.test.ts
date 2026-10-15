import test from 'node:test'
import assert from 'node:assert/strict'
import { isPostSubscriptionValid } from '../validators/isPostSubscriptionValid.ts'


test('Accepts a valid subscription', () => {
    const result = isPostSubscriptionValid({
        name: 'Spotify',
        cost: 11.99,
        category: 'music',
        billing_cycle: 'monthly'
    })

    assert.equal(result.valid, true)
})


test('Rejects cost when it is a string', () => {
    const result = isPostSubscriptionValid({
        name: 'Spotify',
        cost: '11.99',
        category: 'music',
        billing_cycle: 'monthly'
    })

    assert.equal(result.valid, false)
})


test('Rejects a subscription missing its name', () => {
    const result = isPostSubscriptionValid({
        cost: 11.99,
        category: 'music',
        billing_cycle: 'monthly'
    })

    assert.equal(result.valid, false)
})