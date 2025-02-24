"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { user, isAuthenticated, refreshAuth, setIsAuthenticated } = useAuth();
  const pathname = window.location.href;
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
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
        <div>
          { user?.isAdmin === true && (
            <Link href={`/admin`}>
              <FontAwesomeIcon icon={faCog} className="w-6 h-6 flex item-center text-white hover:text-gray-300 me-4" />
            </Link>
          )}
          {!isAuthenticated ? (
            <Link href={`/admin/login?returnUrl=${encodeURIComponent(pathname)}`}>
              <FontAwesomeIcon icon={faSignInAlt} className="w-6 h-6 flex item-center text-white hover:text-gray-300" />
              <span>Login</span>
            </Link>
          ) : (
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="w-6 h-6 flex item-center text-white hover:text-gray-300" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
