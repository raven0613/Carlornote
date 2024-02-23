'use client'

export default function GlobalError({ error, reset }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.log("global error", error)
    return (
        <html>
            <body>
                <h2>得到錯誤</h2>
                <button onClick={() => reset()}>再試試</button>
            </body>
        </html>
    )
}