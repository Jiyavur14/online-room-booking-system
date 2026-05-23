import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Hotel } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Card from "@/app/components/Card";

export default function LoginPage() {
  const { login, register } = useAppContext();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);

        if (user.role === "masterAdmin") {
          navigate("/master-admin-dashboard");
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        await register(formData.email, formData.password);

        // After signup, switch to login mode
        setIsLogin(true);
        setError("Account created successfully. Please login.");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-section-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Hotel className="w-10 h-10 text-primary" />
            <span className="text-3xl font-semibold text-primary">
              StayNest
            </span>
          </Link>
          <h2 className="text-2xl font-semibold mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-text-secondary">
            {isLogin ? "Sign in to your account" : "Sign up to get started"}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
              required
            />

            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder="••••••••"
                required
              />
            )}

            {error && (
              <div className="bg-error/10 border border-error/30 rounded-lg p-3 text-sm text-error">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
