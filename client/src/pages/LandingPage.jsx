import { SignInButton, SignUpButton, useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate("/dashboard");
  }, [isSignedIn]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-blue-700">Planzo</h1>
      <p className="text-gray-500">Smart personal finance tracker</p>
      <div className="flex gap-4">
        <SignInButton mode="modal">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    </div>
  );
}

export default LandingPage;