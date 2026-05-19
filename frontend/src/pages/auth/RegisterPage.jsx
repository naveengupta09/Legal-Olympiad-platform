import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2, Eye, EyeOff, Building2, User,
  GraduationCap, MapPin, Globe, Phone, ChevronRight, ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

// ─── Validation schemas ────────────────────────────────────────────────────────

const studentSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "One uppercase letter required")
    .regex(/[0-9]/, "One number required"),
  role:     z.literal("student"),
});

const collegeAdminSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "One uppercase letter required")
    .regex(/[0-9]/, "One number required"),
  role:             z.literal("college_admin"),
  collegeName:      z.string().min(3, "College name must be at least 3 characters"),
  collegeCity:      z.string().min(2, "City is required"),
  collegeState:     z.string().min(2, "State is required"),
  collegeWebsite:   z.string().url("Enter a valid URL").optional().or(z.literal("")),
  collegeEmail:     z.string().email("Enter a valid college email").optional().or(z.literal("")),
  collegePhone:     z.string().optional(),
  collegeDescription: z.string().max(500, "Max 500 characters").optional(),
});

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={cn(
          "h-1.5 rounded-full transition-all duration-300",
          i < current ? "bg-primary w-6" : i === current ? "bg-primary w-10" : "bg-border w-4"
        )} />
      ))}
    </div>
  );
}

// ─── Role selector card ────────────────────────────────────────────────────────

function RoleCard({ value, label, description, icon: Icon, selected, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/40 hover:bg-muted/50"
      )}>
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
        selected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className={cn("font-semibold text-sm", selected ? "text-primary" : "text-foreground")}>{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate  = useNavigate();
  const [show, setShow]   = useState(false);
  const [role, setRole]   = useState("student");
  const [step, setStep]   = useState(0); // 0 = account info, 1 = college info (admin only)

  const isCollegeAdmin = role === "college_admin";
  const totalSteps     = isCollegeAdmin ? 2 : 1;

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    setError,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(isCollegeAdmin ? collegeAdminSchema : studentSchema),
    defaultValues: { role: "student" },
    mode: "onBlur",
  });

  // Keep role field in sync with local state
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setValue("role", newRole);
    setStep(0); // Reset to step 0 when role changes
  };

  // Validate step 0 fields before advancing to step 1
  const handleNext = async () => {
    const step0Fields = ["name", "email", "password"];
    const valid = await trigger(step0Fields);
    if (valid) setStep(1);
  };

  const onSubmit = async (data) => {
    const payload = {
      name:     data.name,
      email:    data.email,
      password: data.password,
      role:     data.role,
    };

    if (data.role === "college_admin") {
      payload.college = {
        name:        data.collegeName,
        location: {
          city:    data.collegeCity,
          state:   data.collegeState,
          country: "India",
        },
        website:     data.collegeWebsite     || "",
        email:       data.collegeEmail       || "",
        phone:       data.collegePhone       || "",
        description: data.collegeDescription || "",
      };
    }

    const result = await registerUser(payload);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError("root", { message: result.message });
      // If error is about college, go back to step 1
      if (result.message?.toLowerCase().includes("college")) setStep(1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold">Create account</h1>
        <p className="text-muted-foreground text-sm">
          Join thousands of law students on Legal Olympiad
        </p>
      </div>

      {/* Step indicator */}
      {isCollegeAdmin && (
        <div className="flex items-center justify-between">
          <StepIndicator current={step} total={totalSteps} />
          <p className="text-xs text-muted-foreground">Step {step + 1} of {totalSteps}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Global error */}
        {errors.root && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {errors.root.message}
          </div>
        )}

        {/* ── STEP 0: Account info ───────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">

            {/* Role selector */}
            <div className="space-y-2">
              <Label>I am a</Label>
              <div className="grid gap-3">
                <RoleCard
                  value="student"
                  label="Student"
                  description="Join competitions, take courses, build your ranking"
                  icon={GraduationCap}
                  selected={role === "student"}
                  onClick={() => handleRoleChange("student")}
                />
                <RoleCard
                  value="college_admin"
                  label="College Administrator"
                  description="Register your college, manage students and compete"
                  icon={Building2}
                  selected={role === "college_admin"}
                  onClick={() => handleRoleChange("college_admin")}
                />
              </div>
              <input type="hidden" {...register("role")} value={role} />
            </div>

            <Separator />

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder={role === "college_admin" ? "Dr. Priya Mehta" : "Arjun Sharma"}
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === "college_admin" ? "admin@lawcollege.edu" : "you@lawschool.edu"}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* Action: Next (college admin) or Submit (student) */}
            {isCollegeAdmin ? (
              <Button type="button" className="w-full" onClick={handleNext}>
                Next — Add college details <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
                  : "Create account"}
              </Button>
            )}
          </div>
        )}

        {/* ── STEP 1: College info (college_admin only) ─────────────────── */}
        {step === 1 && isCollegeAdmin && (
          <div className="space-y-4 animate-fade-in">

            {/* College name */}
            <div className="space-y-2">
              <Label htmlFor="collegeName" className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                College name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="collegeName"
                placeholder="National Law University, Delhi"
                {...register("collegeName")}
              />
              {errors.collegeName && (
                <p className="text-xs text-destructive">{errors.collegeName.message}</p>
              )}
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="collegeCity" className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  City <span className="text-destructive">*</span>
                </Label>
                <Input id="collegeCity" placeholder="Delhi" {...register("collegeCity")} />
                {errors.collegeCity && (
                  <p className="text-xs text-destructive">{errors.collegeCity.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="collegeState">
                  State <span className="text-destructive">*</span>
                </Label>
                <Input id="collegeState" placeholder="Delhi" {...register("collegeState")} />
                {errors.collegeState && (
                  <p className="text-xs text-destructive">{errors.collegeState.message}</p>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="collegeWebsite" className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                Website
                <span className="text-muted-foreground text-xs font-normal">(optional)</span>
              </Label>
              <Input
                id="collegeWebsite"
                type="url"
                placeholder="https://www.nludelhi.ac.in"
                {...register("collegeWebsite")}
              />
              {errors.collegeWebsite && (
                <p className="text-xs text-destructive">{errors.collegeWebsite.message}</p>
              )}
            </div>

            {/* College email + phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="collegeEmail">
                  College email
                  <span className="text-muted-foreground text-xs font-normal ml-1">(optional)</span>
                </Label>
                <Input
                  id="collegeEmail"
                  type="email"
                  placeholder="info@college.edu"
                  {...register("collegeEmail")}
                />
                {errors.collegeEmail && (
                  <p className="text-xs text-destructive">{errors.collegeEmail.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="collegePhone" className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  Phone
                  <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </Label>
                <Input
                  id="collegePhone"
                  placeholder="+91 98765 43210"
                  {...register("collegePhone")}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="collegeDescription">
                About the college
                <span className="text-muted-foreground text-xs font-normal ml-1">(optional)</span>
              </Label>
              <textarea
                id="collegeDescription"
                rows={3}
                placeholder="Brief description of your college, its specialisation, and legacy…"
                {...register("collegeDescription")}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-colors"
              />
              {errors.collegeDescription && (
                <p className="text-xs text-destructive">{errors.collegeDescription.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch("collegeDescription")?.length || 0}/500 characters
              </p>
            </div>

            {/* Info box */}
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 space-y-1">
              <p className="text-xs font-semibold text-primary">What happens next?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your college will be created and linked to your account. Our team will verify
                it within 24 hours. You can start adding students immediately.
              </p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(0)}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Creating…</>
                  : <>Create account <ChevronRight className="w-4 h-4" /></>}
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* OAuth divider — shown only on step 0 */}
      {step === 0 && (
        <>
          <div className="divider-text">or continue with</div>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/google`}
              className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              {/* Google SVG icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </a>
            <a
              href={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/github`}
              className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              {/* GitHub SVG icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}