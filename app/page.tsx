import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">CSRF Protection Demo</h1>
          <p className="mt-3 text-gray-600">Demonstrating CSRF protection using in-memory tokens</p>
        </div>
        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

