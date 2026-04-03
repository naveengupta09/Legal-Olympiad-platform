import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle2, Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebinar, useRegisterWebinar } from "@/hooks/useWebinars";
import { useAuthStore } from "@/store/authStore";
import { formatDate, formatDateTime, formatDuration } from "@/utils/formatDate";

export default function WebinarDetailPage() {
  const { id } = useParams();
  const { data: res, isLoading } = useWebinar(id);
  const { mutate: register, isPending } = useRegisterWebinar();
  const { user, isLoggedIn } = useAuthStore();
  const w = res?.data;

  if (isLoading) return <div className="container py-12"><Skeleton className="h-96 w-full" /></div>;
  if (!w) return <div className="container py-24 text-center text-muted-foreground">Webinar not found.</div>;

  const isRegistered = w.registrations?.some(r => r.user?._id === user?._id || r.user === user?._id);

  return (
    <div className="container py-12 space-y-8">
      <Link to="/webinars" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />Back to webinars
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-muted relative">
            {w.coverImage ? <img src={w.coverImage} alt={w.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"><Video className="w-16 h-16 text-primary/30" /></div>}
            {w.status==="live" && <Badge variant="live" className="absolute top-4 left-4">● LIVE NOW</Badge>}
          </div>

          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {w.tags?.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
            </div>
            <h1 className="font-display text-3xl font-bold">{w.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{w.description}</p>
          </div>

          {/* Speakers */}
          {w.speakers?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Speakers</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {w.speakers.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="w-10 h-10"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name?.[0]}</AvatarFallback></Avatar>
                    <div><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.designation}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recording */}
          {w.recordingUrl && w.status==="completed" && (
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div><p className="font-semibold">Recording Available</p><p className="text-sm text-muted-foreground">Watch the full session</p></div>
                <Button asChild><a href={w.recordingUrl} target="_blank" rel="noreferrer"><Video className="w-4 h-4" />Watch now</a></Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <Card className="h-fit sticky top-24">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3 text-sm">
              {[
                { icon: Calendar, label: "Date & time", value: formatDateTime(w.scheduledAt) },
                { icon: Clock,    label: "Duration",    value: formatDuration(w.durationMinutes) },
                { icon: Users,    label: "Registered",  value: `${w.registrations?.length || 0} attendees` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div><p className="text-muted-foreground text-xs">{label}</p><p className="font-medium">{value}</p></div>
                </div>
              ))}
            </div>
            {w.certificateProvided && <Badge variant="gold" className="w-full justify-center py-1.5">Certificate provided</Badge>}
            <Separator />
            {isRegistered ? (
              <div className="text-center text-green-600 text-sm font-medium flex items-center justify-center gap-2 py-2">
                <CheckCircle2 className="w-4 h-4" />You're registered
              </div>
            ) : !isLoggedIn() ? (
              <Button className="w-full" asChild><Link to="/login">Log in to register</Link></Button>
            ) : w.status==="upcoming" ? (
              <Button className="w-full" onClick={() => register(w._id)} disabled={isPending}>
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Registering…</> : "Register for free"}
              </Button>
            ) : (
              <Button className="w-full" disabled variant="outline">Registration closed</Button>
            )}
            {w.platformLink && isRegistered && (
              <Button variant="outline" className="w-full" asChild>
                <a href={w.platformLink} target="_blank" rel="noreferrer">Join meeting</a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}