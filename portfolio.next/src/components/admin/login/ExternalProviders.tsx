return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Or Login with</h3>
            <div className="flex flex-col gap-2">
              <Link
                href={`${AUTH_API.auth.oauth.google}?returnUrl=${encodeURIComponent(returnUrl)}`}
                className="bg-red-500 text-white text-center py-2 rounded"
              >
                Login with Google
              </Link>
              <Link
                href={`${AUTH_API.auth.oauth.facebook}?returnUrl=${encodeURIComponent(returnUrl)}`}
                className="bg-blue-600 text-white text-center py-2 rounded"
              >
                Login with Facebook
              </Link>
            </div>
          </div>
    
);