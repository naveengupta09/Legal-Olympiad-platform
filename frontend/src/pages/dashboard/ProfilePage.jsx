import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Save, Trophy, BookOpen, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/api/user.api";
import { formatScore, getRankLabel } from "@/utils/formatScore";
import { formatDate } from "@/utils/formatDate";
import toast from "react-hot-toast";

const schema = z.object({
  name:  z.string().min(2, "Name too short"),
  phone: z.string().optional(),
  bio:   z.string().max(500, "Bio max 500 chars").optional(),
  "socialLinks.linkedin": z.string().url("Invalid URL").optional().or(z.literal("")),
  "socialLinks.twitter":  z.string().url("Invalid URL").optional().or(z.literal("")),
  "socialLinks.instagram": z.string().url("Invalid URL").optional().or(z.literal("")),
  "socialLinks.portfolio": z.string().url("Invalid URL").optional().or(z.literal("")),
});

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name:  user?.name  || "",
      phone: user?.phone || "",
      bio:   user?.bio   || "",
      "socialLinks.linkedin": user?.socialLinks?.linkedin || "",
      "socialLinks.twitter":  user?.socialLinks?.twitter  || "",
      "socialLinks.instagram": user?.socialLinks?.instagram || "",
      "socialLinks.portfolio": user?.socialLinks?.portfolio || "",
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await userApi.updateProfile({
        name: data.name, phone: data.phone, bio: data.bio,
        socialLinks: {
          linkedin: data["socialLinks.linkedin"],
          twitter: data["socialLinks.twitter"],
          instagram: data["socialLinks.instagram"],
          portfolio: data["socialLinks.portfolio"],
        },
      });
      updateUser(res.data);
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update"); } finally { setSaving(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("avatar", file);
      const res = await userApi.updateAvatar(fd);
      updateUser({ avatar: res.data.avatar });
      toast.success("Avatar updated!");
    } catch { toast.error("Failed to upload"); } finally { setUploading(false); }
  };

  return (
    <div className="container max-w-4xl py-12 space-y-8">
      <div className="space-y-1"><h1 className="font-display text-3xl font-bold">My Profile</h1><p className="text-muted-foreground">Manage your account information</p></div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: avatar + stats */}
        <div className="space-y-4">
          <Card className="p-6 text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Camera className="w-3.5 h-3.5"/>}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading}/>
              </label>
            </div>
            <div>
              <p className="font-display font-bold text-xl">{user?.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user?.role?.replace("_"," ")}</p>
              {user?.college?.name && <p className="text-xs text-muted-foreground mt-1">{user.college.name}</p>}
            </div>
            <Separator/>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><p className="font-bold text-lg text-primary">{user?.rank ? getRankLabel(user.rank) : "—"}</p><p className="text-xs text-muted-foreground">Rank</p></div>
              <div><p className="font-bold text-lg">{formatScore(user?.totalScore||0)}</p><p className="text-xs text-muted-foreground">Score</p></div>
              <div><p className="font-bold text-lg">{user?.enrolledCourses?.length||0}</p><p className="text-xs text-muted-foreground">Courses</p></div>
              <div><p className="font-bold text-lg">{user?.registeredCompetitions?.length||0}</p><p className="text-xs text-muted-foreground">Competitions</p></div>
            </div>
          </Card>

          {/* Achievements */}
          {user?.achievements?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500"/>Achievements</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.achievements.map(a => (
                  <Badge key={a._id} variant="gold" className="gap-1">{a.icon && <span>{a.icon}</span>}{a.title}</Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: edit form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Edit profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full name</Label>
                    <Input {...register("name")} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input {...register("phone")} placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email} disabled className="opacity-60" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <textarea {...register("bio")} rows={3} placeholder="Tell others about yourself…"
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-colors"/>
                  {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
                </div>
                <Separator/>
                <div className="space-y-4">
                  <p className="text-sm font-medium">Social links</p>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>LinkedIn URL</Label>
                      <Input {...register("socialLinks.linkedin")} placeholder="https://linkedin.com/in/..." />
                      {errors["socialLinks.linkedin"] && <p className="text-xs text-destructive">{errors["socialLinks.linkedin"].message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Instagram URL</Label>
                      <Input {...register("socialLinks.instagram")} placeholder="https://instagram.com/..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Portfolio URL</Label>
                      <Input {...register("socialLinks.portfolio")} placeholder="https://your-site.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter URL</Label>
                      <Input {...register("socialLinks.twitter")} placeholder="https://twitter.com/..." />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}Save changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}