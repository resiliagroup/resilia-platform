export default function SiteHaritasiLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#F8FAFC' }}>{children}</div>
}
