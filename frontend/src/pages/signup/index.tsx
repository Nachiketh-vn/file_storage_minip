import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuArrowLeft, LuLoader2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { AuthError } from "@supabase/supabase-js";

export default function Signup() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);

  const navigate = useNavigate();

  const { signUp } = useAuth();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-300">
      <div className="flex min-w-96 flex-row-reverse items-center rounded-3xl bg-slate-100 p-16 shadow-2xl lg:gap-x-16">
        <div className="hidden lg:block">
          <img
            src="/images/login-hero.svg"
            className="bg-transparent"
            alt="hero-img"
            width={500}
            height={600}
          />
        </div>
        <div>
          <Link to="/">
            <span className="flex items-center gap-x-1 text-sm underline ">
              <LuArrowLeft size={16} /> back to website
            </span>
          </Link>
          <h2 className="mb-2 mt-8 text-2xl">Welcome!</h2>
          <p className="mb-8 text-sm">
            Create an account or{" "}
            <Link to="/login" className="underline">
              login
            </Link>{" "}
            to start using
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              signUp(email, password, username).then(({ error }) => {
                setLoading(true);
                if (error) {
                  console.log("error", error);
                  setError(error);
                  return;
                }
                navigate("/app?view=default");
              });
            }}
          >
            <Label>Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 rounded-full border-gray-900 bg-transparent "
            />
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 rounded-full border-gray-900 bg-transparent "
            />
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-full border-gray-900 bg-transparent"
            />
            <p className="my-4 text-right text-xs underline">Forgot Password</p>
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={loading}
            >
              {loading ? (
                <LuLoader2 className={"mr-2 h-4 w-4 animate-spin"} />
              ) : (
                "Sign Up"
              )}
            </Button>
            <Button variant="outline" className="my-3 w-full rounded-full">
              <FcGoogle className="mr-2 h-6 w-6" />
              Log in with Google
            </Button>
            {error && (
              <p className="text-center text-sm text-foreground text-red-600">
                {error.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
