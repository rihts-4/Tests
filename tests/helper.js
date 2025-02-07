const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()

    await page.getByPlaceholder('title').fill(title)
    await page.getByPlaceholder('author').fill(author)
    await page.getByPlaceholder('url').fill(url)

    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(`${title} ${author}`).waitFor()
}

module.exports = { createBlog }