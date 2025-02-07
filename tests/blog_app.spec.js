const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/test/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                username: 'rootuser',
                name: 'My App',
                password: 'myblog'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const loginForm = await page.locator('.login-form')

        await expect(loginForm).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('rootuser')
            await page.getByTestId('password').fill('myblog')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('My App logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('rootuser')
            await page.getByTestId('password').fill('wrong')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('invalid username or password')).toBeVisible()
        })

        describe('When logged in', () => {
            beforeEach(async ({ page }) => {
                await page.getByTestId('username').fill('rootuser')
                await page.getByTestId('password').fill('myblog')
    
                await page.getByRole('button', { name: 'login' }).click()
            })

            test('a new blog can be created', async ({ page }) => {
                await page.getByRole('button', { name: 'new blog' }).click()

                await page.getByPlaceholder('title').fill('a new blog')
                await page.getByPlaceholder('author').fill('first author')
                await page.getByPlaceholder('url').fill('http://example.com')

                await page.getByRole('button', { name: 'create' }).click()

                await expect(page.getByText('a new blog first author')).toBeVisible()
            })

            describe('and a blog exists', () => {
                beforeEach(async ({ page }) => {
                    await createBlog(page, 'a new blog', 'first author', 'http://example.com')
                })

                test('it can be liked', async ({ page }) => {
                    await page.getByRole('button', { name: 'view' }).click()
                    await page.getByRole('button', { name: 'like' }).click()

                    await expect(page.getByText('likes 1')).toBeVisible()
                })

                test('it can be deleted', async ({ page }) => {
                    await page.getByRole('button', { name: 'view' }).click()

                    page.on('dialog', async dialog => {
                        await dialog.accept()
                    })

                    await page.getByRole('button', { name: 'remove' }).click()
                    await expect(page.getByText('a new blog first author')).not.toBeVisible()
                })

                test('only creator can delete the blog', async ({ page, request }) => {
                    await request.post('http://localhost:3001/api/users', {
                        data: {
                            username: 'anotheruser',
                            name: 'Second User',
                            password: 'second'
                        }
                    })

                    await page.getByRole('button', { name: 'logout' }).click()

                    await page.getByTestId('username').fill('anotheruser')
                    await page.getByTestId('password').fill('second')
        
                    await page.getByRole('button', { name: 'login' }).click()

                    await page.getByRole('button', { name: 'view' }).click()
                    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
                })
            })

            describe('and multiple blogs exist', () => {
                beforeEach(async ({ page }) => {
                    await createBlog(page, 'a new blog', 'first author', 'http://example.com')
                    await createBlog(page, 'another blog', 'second author', 'http://example.com')
                })

                test('blogs', async ({ page }) => {
                    const blogs = await page.locator('.blog').all()
                    await expect(blogs[0]).toContainText('a new blog first author')

                    await page.getByRole('button', { name: 'view' }).last().click()
                    await page.getByRole('button', { name: 'like' }).click()

                    await expect(blogs[0]).toContainText('another blog second author')
                })
            })
        })
    })
})