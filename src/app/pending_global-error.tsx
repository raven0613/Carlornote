'use client'

export default function GlobalError({ error, reset }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.log("global error", error)
    return (
        <html>
            <body>
                <h2>Error</h2>
                <button onClick={() => reset()}>reset</button>
            </body>
        </html>
    )
}