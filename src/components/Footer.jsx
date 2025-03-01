export default function Footer() {
  return (
    <footer className="container mx-auto px-4 py-6 text-center text-white">
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/contact" className="hover:underline">Contact Us</a>
      </div>
      <p>© {new Date().getFullYear()} 4D Leader. All rights reserved.</p>
    </footer>
  );
}