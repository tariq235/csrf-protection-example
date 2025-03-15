"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/app/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    setLogs((prev) => [...prev, `[CLIENT] Login attempt with email: ${formData.get("email")}`])

    try {
      const result = await login(formData)

      if (result.success) {
        // Store the CSRF token in memory (not in cookies)
        window.csrfToken = result.csrfToken
        setLogs((prev) => [
          ...prev,
          `[CLIENT] Login successful, received CSRF token: ${result.csrfToken.substring(0, 8)}...`,
        ])
        setLogs((prev) => [...prev, `[CLIENT] Storing token in memory (not in cookies)`])
        setLogs((prev) => [...prev, `[CLIENT] Redirecting to dashboard...`])
        router.push("/dashboard")
      } else {
        setLogs((prev) => [...prev, `[CLIENT] Login failed: ${result.error}`])
        setError(result.error || "Login failed")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setLogs((prev) => [...prev, `[CLIENT] Exception: ${errorMessage}`])
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue="user@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" defaultValue="password123" required />
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-2">Login Logs:</p>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-xs h-32 overflow-y-auto">
                {logs.length === 0 ? (
                  <p>No logs yet. Submit the form to see logs.</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

