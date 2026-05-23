import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Card from "@/app/components/Card";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Hardcoded super admin credentials (in real app, verify from backend)
    if (email === "masteradmin@staynest.com" && password === "SuperAdmin123") {
      const user = login(email, password);
      setTimeout(() => {
        navigate("/super-admin-dashboard");
      }, 500);
    } else {
      setError("Invalid super admin credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Super Admin Portal</h1>
            <p className="text-sm text-text-secondary">
              Restricted access for system administrators only
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  type="email"
                  placeholder="masteradmin@staynest.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  type="password"
                  placeholder="Enter super admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login as Super Admin"}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <p className="text-xs text-text-secondary text-center">
              <strong className="text-warning">Security Notice:</strong> All
              login attempts are monitored and logged. Unauthorized access
              attempts will be reported.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
