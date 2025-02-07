import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { describe } from 'vitest'

let container

describe('show blog', () => {
  beforeEach(() => {
    const blog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
      likes: 10,
      id: 'test id',
      user: {
        name: 'test name',
        username: 'test username',
        id: 'test id'
      }
    }

    const blogUser = {
      name: 'test name',
      username: 'test username',
      id: 'test id'
    }

    container = render(<Blog blog={blog} user={blogUser} />).container
  })

  test('content is rendered', () => {
    const element = screen.getByText('test title test author')
    expect(element).toBeDefined()

    const div = container.querySelector('.details')

    expect(div).toHaveStyle('display: none')
    expect(div).not.toBeVisible()
  })

  test('url and likes are shown when button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.details')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toBeVisible()
  })
})

test('like button is clicked twice', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 10,
    id: 'test id',
    user: {
      name: 'test name',
      username: 'test username',
      id: 'test id'
    }
  }

  const blogUser = {
    name: 'test name',
    username: 'test username',
    id: 'test id'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={blogUser} likeBlog={mockHandler} />)
  screen.debug()

  const user = userEvent.setup()

  const likeButton = screen.getByText('like')
  await user.dblClick(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})