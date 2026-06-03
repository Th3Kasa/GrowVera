export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-white font-bold">GrowVera</span>
        <p className="text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} GrowVera. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
