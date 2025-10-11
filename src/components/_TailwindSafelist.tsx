/**
 * This component is never rendered but forces Tailwind v4 to generate
 * utility classes used by HeroUI Modal component that are applied dynamically.
 *
 * In Tailwind v4, the @source inline() directive doesn't work reliably,
 * so we need actual class usage in scanned files.
 */
export function _TailwindSafelist() {
  return (
    <div className="fixed inset-0 z-50 flex items-center items-end justify-center w-screen overflow-x-auto">
      {/* This component is never rendered */}
    </div>
  )
}
