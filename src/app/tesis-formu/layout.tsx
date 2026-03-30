export default function TesisFormuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0A1628' }}>
      {children}
    </div>
  )
}
