import { useParams } from "react-router-dom";
import { Calendar, Trophy, Users, Clock, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCompetition, useRegisterCompetition } from "@/hooks/useCompetitions";
import { useAuthStore } from "@/store/authStore";
import { formatDate, formatScore } from "@/utils/formatDate";

const STATUS_COLORS = {
  upcoming: "secondary", registration_open: "success",
  ongoing: "warning", completed: "outline", cancelled: "destructive",
};

export default function CompetitionDetailPage() {
  const { id } = useParams();
  const { data: res, isLoading } = useCompetition(id);
  const { mutate: register, isPending } = useRegisterCompetition();
  const { user, isLoggedIn } = useAuthStore();

  const comp = res?.data;

  if (isLoading) return (
    <div className="container py-12 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="aspect-[16/5] w-full rounded-xl" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4"><Skeleton className="h-64 w-full" /></div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );

  if (!comp) return <div className="container py-24 text-center text-muted-foreground">Competition not found.</div>;

  const isRegistered = comp.registrations?.some(r => r.user?._id === user?._id || r.user === user?._id);
  const canRegister  = comp.status === "registration_open" && isLoggedIn() && !isRegistered;

  return (
    <div className="container py-12 space-y-8">
      <Link to="/competitions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to competitions
      </Link>

      {/* Cover */}
      <div className="relative aspect-[16/5] rounded-2xl overflow-hidden bg-muted">
        {comp.coverImage
          ? <img src={comp.coverImage} alt={comp.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center"><Trophy className="w-16 h-16 text-primary/30" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge variant={STATUS_COLORS[comp.status] || "secondary"} className="capitalize">{comp.status?.replace("_"," ")}</Badge>
              <Badge variant="outline" className="border-white/30 text-white text-[10px] uppercase">{comp.type?.replace(/_/g," ")}</Badge>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white">{comp.title}</h1>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card>
            <CardHeader><CardTitle>About this competition</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{comp.description}</p>
            </CardContent>
          </Card>

          {/* Prizes */}
          {comp.prizes?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />Prize Breakdown</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                {comp.prizes.map((prize, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="font-semibold">{prize.position}</span>
                    <span className="text-yellow-600 font-bold">₹{prize.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Rules */}
          {comp.rules && (
            <Card>
              <CardHeader><CardTitle>Rules & Guidelines</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{comp.rules}</p></CardContent>
            </Card>
          )}

          {/* Rounds */}
          {comp.rounds?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Rounds</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {comp.rounds.map(round => (
                  <div key={round._id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{round.roundNumber}</div>
                    <div>
                      <p className="font-semibold">{round.title}</p>
                      {round.description && <p className="text-sm text-muted-foreground mt-1">{round.description}</p>}
                      {round.startDate && <p className="text-xs text-muted-foreground mt-1"><Calendar className="w-3 h-3 inline mr-1" />{formatDate(round.startDate)}</p>}
                    </div>
                    {round.isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto shrink-0" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Registration CTA */}
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              {comp.prizePool > 0 && (
                <div className="text-center p-4 bg-yellow-500/10 rounded-xl">
                  <p className="text-xs text-muted-foreground">Total Prize Pool</p>
                  <p className="font-display text-3xl font-bold text-yellow-600">₹{comp.prizePool?.toLocaleString()}</p>
                </div>
              )}
              <Separator />
              <div className="space-y-3 text-sm">
                {[
                  { icon: Calendar, label: "Start date",   value: formatDate(comp.startDate) },
                  { icon: Calendar, label: "End date",     value: formatDate(comp.endDate) },
                  { icon: Clock,    label: "Reg. deadline",value: formatDate(comp.registrationDeadline) },
                  { icon: Users,    label: "Registered",   value: `${comp.registrations?.length || 0} participants` },
                  { icon: Trophy,   label: "Entry fee",    value: comp.entryFee > 0 ? `₹${comp.entryFee}` : "Free" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" />{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <Separator />
              {isRegistered ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium justify-center py-2">
                  <CheckCircle2 className="w-4 h-4" /> You're registered!
                </div>
              ) : !isLoggedIn() ? (
                <Button className="w-full" asChild>
                  <Link to="/login">Log in to register</Link>
                </Button>
              ) : canRegister ? (
                <Button className="w-full" onClick={() => register(comp._id)} disabled={isPending}>
                  {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Registering…</> : "Register now"}
                </Button>
              ) : (
                <Button className="w-full" disabled variant="outline">Registration closed</Button>
              )}
            </CardContent>
          </Card>

          {/* Organizer */}
          {comp.organizer && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Avatar><AvatarImage src={comp.organizer.avatar} /><AvatarFallback>{comp.organizer.name?.[0]}</AvatarFallback></Avatar>
                <div><p className="text-xs text-muted-foreground">Organized by</p><p className="font-semibold text-sm">{comp.organizer.name}</p></div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}