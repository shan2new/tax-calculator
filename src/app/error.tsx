"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Readonly<ErrorPageProps>) {
  return (
    <html lang="en-IN">
      <body>
        <main
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "#050505",
            color: "#E8E4DE",
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Claros
            </p>
            <h1
              style={{
                margin: "12px 0 8px",
                fontSize: 28,
                fontWeight: 200,
                letterSpacing: "-0.04em",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              The app hit an unexpected error. Try reloading this surface and continue where you
              left off.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: 20,
                minHeight: 44,
                padding: "0 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "#E8E4DE",
                font: "inherit",
                cursor: "pointer",
              }}
            >
              Reload view
            </button>
            {error.digest ? (
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                Ref: {error.digest}
              </p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
