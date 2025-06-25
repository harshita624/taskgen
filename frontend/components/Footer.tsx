export default function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-gray-400 border-t">
      &copy; {new Date().getFullYear()} AI Task Manager. Built with ❤️ and Next.js
    </footer>
  );
}