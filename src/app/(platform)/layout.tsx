import SidebarWrapper from './SidebarWrapper'

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <SidebarWrapper>{children}</SidebarWrapper>
}
