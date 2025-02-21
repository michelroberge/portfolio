import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white py-6 text-center">
      <Link href="/" className="block">
        <h1 className="text-3xl font-bold hover:text-gray-300 transition">
          Curious Coder: A Portfolio
        </h1>
        <p className="text-lg">a.k.a. michel-roberge.com</p>
        <p className="text-xs">(the Northern Developer)</p>
      </Link>
    </header>
  );
}
