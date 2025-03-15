"use server"

import { validateCsrfToken } from "./auth"

// In-memory store for posts
// In a real application, you would use a database
const posts = new Map<string, { id: string; title: string; content: string; userId: string }>()

export async function createPost(formData: FormData, csrfToken: string) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  console.log(`[POSTS] Create post request received`)
  console.log(`[POSTS] Title: ${title}`)
  console.log(`[POSTS] Content length: ${content?.length || 0} characters`)
  console.log(`[POSTS] CSRF Token provided: ${csrfToken ? csrfToken.substring(0, 8) + "..." : "none"}`)

  // Basic validation
  if (!title || !content) {
    console.log(`[POSTS] Validation failed: Title and content are required`)
    return { success: false, error: "Title and content are required" }
  }

  // In a real application, you would get the user ID from the session
  // For this demo, we'll use a hardcoded user ID
  const userId = "user1"
  console.log(`[POSTS] Using user ID: ${userId}`)

  // Validate the CSRF token - now with await since it's async
  console.log(`[POSTS] Validating CSRF token...`)
  const isValidToken = await validateCsrfToken(userId, csrfToken)

  if (!isValidToken) {
    console.log(`[POSTS] CSRF validation failed, rejecting request`)
    return { success: false, error: "Invalid CSRF token" }
  }

  console.log(`[POSTS] CSRF validation successful, processing request`)

  // Create a new post
  const postId = `post_${Date.now()}`

  posts.set(postId, {
    id: postId,
    title,
    content,
    userId,
  })

  console.log(`[POSTS] Post created successfully with ID: ${postId}`)
  console.log(
    `[POSTS] Current posts:`,
    Object.fromEntries(
      [...posts.entries()].map(([k, v]) => [
        k,
        { ...v, content: v.content.substring(0, 20) + (v.content.length > 20 ? "..." : "") },
      ]),
    ),
  )

  return { success: true }
}

