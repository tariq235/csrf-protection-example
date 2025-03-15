"use server"

// In-memory store for CSRF tokens and user sessions
// In a real application, you would use a database or Redis
const tokenStore = new Map<string, { userId: string; token: string }>()
const users = new Map<string, { id: string; email: string; password: string }>()

// Initialize with a test user
users.set("user@example.com", {
  id: "user1",
  email: "user@example.com",
  password: "password123", // In a real app, this would be hashed
})

// Generate a secure random token
async function generateToken(length = 32) {
  const array = new Uint8Array(length)

  // Use the Web Crypto API which is available in both Node.js and browsers
  if (typeof crypto !== "undefined") {
    crypto.getRandomValues(array)
  } else {
    // Fallback for older Node.js versions
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }

  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log(`[AUTH] Login attempt for email: ${email}`)

  // Basic validation
  if (!email || !password) {
    console.log(`[AUTH] Login failed: Email and password are required`)
    return { success: false, error: "Email and password are required" }
  }

  // Check if user exists (in a real app, you would query a database)
  const user = users.get(email)

  if (!user || user.password !== password) {
    console.log(`[AUTH] Login failed: Invalid credentials`)
    return { success: false, error: "Invalid email or password" }
  }

  // Generate a CSRF token
  const csrfToken = await generateToken()
  console.log(`[AUTH] Generated CSRF token for user ${user.id}: ${csrfToken.substring(0, 8)}...`)

  // Store the token in memory (associated with the user)
  tokenStore.set(user.id, { userId: user.id, token: csrfToken })
  console.log(`[AUTH] Stored CSRF token in memory for user ${user.id}`)
  console.log(
    `[AUTH] Current token store:`,
    Object.fromEntries(
      [...tokenStore.entries()].map(([k, v]) => [k, { ...v, token: v.token.substring(0, 8) + "..." }]),
    ),
  )

  // Return the token to the client
  console.log(`[AUTH] Login successful, returning CSRF token to client`)
  return {
    success: true,
    csrfToken,
  }
}

// Function to validate a CSRF token - changed to async
export async function validateCsrfToken(userId: string, token: string): Promise<boolean> {
  console.log(`[AUTH] Validating CSRF token for user ${userId}`)
  console.log(`[AUTH] Received token: ${token.substring(0, 8)}...`)

  const storedData = tokenStore.get(userId)

  if (!storedData) {
    console.log(`[AUTH] No token found for user ${userId}`)
    return false
  }

  console.log(`[AUTH] Stored token: ${storedData.token.substring(0, 8)}...`)
  const isValid = storedData.token === token
  console.log(`[AUTH] Token validation ${isValid ? "SUCCESSFUL" : "FAILED"}`)

  return isValid
}

