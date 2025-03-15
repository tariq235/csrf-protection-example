"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createPost } from "@/app/actions/posts"
import { Textarea } from "@/components/ui/textarea"

// Augment the Window interface to include our custom property
declare global {
  interface Window {
    csrfToken?: string
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  // Check if user has a CSRF token (is logged in)
  useEffect(() => {
    if (!window.csrfToken) {
      router.push("/login")
    } else {
      // Log the token to the UI (first 8 chars only for security)
      const tokenPreview = window.csrfToken.substring(0, 8) + "..."
      setLogs((prev) => [...prev, `[CLIENT] CSRF Token in memory: ${tokenPreview}`])
    }
  }, [router])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)

    try {
      // Get the CSRF token from memory
      const csrfToken = window.csrfToken

      if (!csrfToken) {
        setMessage({ text: "No CSRF token found. Please login again.", type: "error" })
        router.push("/login")
        return
      }

      setLogs((prev) => [...prev, `[CLIENT] Sending request with CSRF token: ${csrfToken.substring(0, 8)}...`])

      const result = await createPost(formData, csrfToken)

      if (result.success) {
        setLogs((prev) => [...prev, `[CLIENT] Post created successfully!`])
        setMessage({ text: "Post created successfully!", type: "success" })
        // Reset the form
        const form = document.getElementById("post-form") as HTMLFormElement
        form?.reset()
      } else {
        setLogs((prev) => [...prev, `[CLIENT] Error: ${result.error}`])
        setMessage({ text: result.error || "Failed to create post", type: "error" })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setLogs((prev) => [...prev, `[CLIENT] Exception: ${errorMessage}`])
      setMessage({ text: "An unexpected error occurred", type: "error" })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogout() {
    setLogs((prev) => [...prev, `[CLIENT] Logging out, clearing CSRF token`])
    // Clear the CSRF token from memory
    window.csrfToken = undefined
    router.push("/login")
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>This form is protected by CSRF token validation</CardDescription>
          </CardHeader>
          <form id="post-form" action={handleSubmit}>
            <CardContent className="space-y-4">
              {message && (
                <Alert variant={message.type === "error" ? "destructive" : "default"}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" rows={4} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSRF Protection Logs</CardTitle>
            <CardDescription>See what's happening behind the scenes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <p>No logs yet. Create a post to see the CSRF validation in action.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

