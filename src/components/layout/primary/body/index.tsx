/** Main content area, offset below the fixed header. */
export default function PageBody({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="min-h-[60dvh] pt-16 md:pt-[4.5rem]">
      {children}
    </main>
  )
}
