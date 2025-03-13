"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faCog, faContactCard, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from "next/navigation";
import { AUTH_API } from "@/lib/constants";

export default function Header() {
  const { isAdmin, isAuthenticated, refreshAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch(AUTH_API.auth.logout, {
        credentials: "include",
      });
      if (res.ok) {
        await refreshAuth();
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <header className="bg-gray-800 text-white py-6 relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <div>
            <h1 className="text-3xl font-bold hover:text-gray-300 transition">
              Curious Coder: A Portfolio
            </h1>
            <p className="text-lg">a.k.a. michel-roberge.com</p>
            <p className="text-xs">(the Northern Developer)</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">

        <Link href="/pages/about" className="flex items-center gap-2 text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faContactCard} className="w-6 h-6" />
              <span>About me</span>
            </Link>

        <Link href="/career" className="flex items-center gap-2 text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faAlignLeft} className="w-6 h-6" />
              <span>Experience</span>
            </Link>


          {isAuthenticated && isAdmin && (
            <Link href={`/admin`} className="flex items-center gap-2 text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faCog} className="w-6 h-6" />
              <span>Admin Panel</span>
            </Link>
          )}

          {!isAuthenticated ? (
            <Link href={`/admin/login?returnUrl=${encodeURIComponent(pathname)}`} className="flex items-center gap-2 text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faSignInAlt} className="w-6 h-6" />
              <span>Login</span>
            </Link>
          ) : (
            <button onClick={handleLogout} className="flex items-center gap-2 text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-6 h-6" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
