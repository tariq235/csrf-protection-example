import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About CSRF Protection</h1>

        <div className="prose dark:prose-invert">
          <h2>What is CSRF?</h2>
          <p>
            Cross-Site Request Forgery (CSRF) is an attack that forces authenticated users to submit a request to a web
            application against which they are currently authenticated.
          </p>

          <h2>How This Demo Works</h2>
          <p>This application demonstrates CSRF protection using in-memory tokens instead of cookies:</p>

          <ol>
            <li>When you log in, the server generates a random CSRF token</li>
            <li>The token is stored in-memory on the server (associated with your session)</li>
            <li>The token is returned to the client and stored in memory (not in cookies)</li>
            <li>When you submit the "Create Post" form, the token is sent in a custom header</li>
            <li>The server validates the token before processing the request</li>
          </ol>

          <h2>Why In-Memory Tokens?</h2>
          <p>Using in-memory tokens instead of cookies provides several advantages:</p>

          <ul>
            <li>Tokens aren't automatically sent with every request</li>
            <li>Tokens aren't vulnerable to XSS attacks that can steal cookies</li>
            <li>Tokens can be regenerated frequently for enhanced security</li>
          </ul>
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

