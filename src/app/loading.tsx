export default function Loading() {
  return (
    <main
      style={{
        padding: "max(48px, env(safe-area-inset-top)) 24px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 120,
          height: 12,
          borderRadius: 999,
          background: "var(--border)",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          width: "100%",
          height: 240,
          borderRadius: 32,
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      />
      <div
        style={{
          width: "100%",
          height: 92,
          borderRadius: 24,
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      />
      <div
        style={{
          width: "100%",
          height: 92,
          borderRadius: 24,
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      />
    </main>
  );
}
