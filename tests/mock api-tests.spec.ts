import { test, expect } from '@playwright/test';


test ('API Delete request', async ({request }) => {
    const response = await request.delete('https://reqres.in/api/users/2', {
       headers: {
        'Content-Type': 'application/json',
        'x-api-key' : 'reqres-free-v1',
       },
    })
})
test('API Put request', async ({ request }) => {

    const response = await request.put('https://reqres.in/api/users/2', {
       headers: {
        'Content-Type': 'application/json',
        'x-api-key' : 'reqres-free-v1',
       },
        data: {
            name: 'Riley',
            job: 'Student Developer'
        }
    })

    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('Riley')
    console.log(await response.json())


})
test('API Post request', async ({ request }) => {

    const response = await request.post('https://reqres.in/api/users', {
       headers: {
        'Content-Type': 'application/json',
        'x-api-key' : 'reqres-free-v1',
       },
        data: {
            name: 'Riley',
            job: 'Student Developer'
        }
    })

    expect(response.status()).toBe(201)
    const text = await response.text()
    expect(text).toContain('Riley')
    console.log(await response.json())
})
test("API Get request", async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2')
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('fuchsia rose')
    console.log(await response.json())
});