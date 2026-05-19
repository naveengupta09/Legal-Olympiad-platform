import { Link } from "react-router-dom";
import { Trophy, BookOpen, Calendar, Bell, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { useMyRanking } from "@/hooks/useRankings";
import { useNotifications } from "@/hooks/useNotifications";
import { useCourses } from "@/hooks/useCourses";
import { useCompetitions } from "@/hooks/useCompetitions";
import { formatScore, getRankLabel } from "@/utils/formatScore";
import { formatDate, formatRelative } from "@/utils/formatDate";

function StatCard({ icon: Icon, label, value, sub, color = "bg-primary/10 text-primary" }) {
  return (
    <Card className="p-5 space-y-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
      <div><p className="font-display text-2xl font-bold">{value}</p><p className="text-sm font-medium">{label}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: rankRes, isLoading: rankLoading } = useMyRanking("all_time");
  const { data: notifRes } = useNotifications({ limit: 5 });
  const { data: coursesRes } = useCourses({ limit: 4 });
  const { data: compsRes } = useCompetitions({ status: "registration_open", limit: 4 });

  const ranking = rankRes;
  const notifications = notifRes?.data || [];
  const courses = coursesRes?.data || [];
  const competitions = compsRes?.data || [];
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 ring-2 ring-primary/20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}!</h1>
            <p className="text-muted-foreground text-sm capitalize">{user?.role?.replace("_", " ")} · {user?.college?.name || "Independent"}</p>
          </div>
        </div>
        <Button asChild><Link to="/profile">View profile <ArrowRight className="w-4 h-4" /></Link></Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {rankLoading ? Array.from({length:4}).map((_,i)=><Card key={i} className="p-5"><Skeleton className="h-16 w-full"/></Card>) : (
          <>
            <StatCard icon={Trophy} label="Current Rank" value={ranking ? getRankLabel(ranking.rank) : "—"} sub="All time" color="bg-yellow-500/10 text-yellow-600"/>
            <StatCard icon={TrendingUp} label="Total Score" value={formatScore(user?.totalScore||0)} sub="Points earned"/>
            <StatCard icon={BookOpen} label="Courses" value={user?.enrolledCourses?.length||0} sub="Enrolled" color="bg-green-500/10 text-green-600"/>
            <StatCard icon={Calendar} label="Competitions" value={user?.registeredCompetitions?.length||0} sub="Registered" color="bg-purple-500/10 text-purple-600"/>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Notifications</h2><Bell className="w-4 h-4 text-muted-foreground"/></div>
          <Card>
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm"><Bell className="w-8 h-8 mx-auto mb-2 opacity-20"/>All caught up!</div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(n => (
                  <div key={n._id} className={`p-4 space-y-1 ${!n.isRead?"bg-primary/5":""}`}>
                    <div className="flex items-start gap-2">
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"/>}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatRelative(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Available Courses</h2>
            <Button variant="ghost" size="sm" asChild className="text-primary"><Link to="/courses">View all <ArrowRight className="w-3.5 h-3.5"/></Link></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {courses.length === 0 ? (
              <Card className="sm:col-span-2 p-8 text-center text-muted-foreground"><BookOpen className="w-8 h-8 mx-auto mb-2 opacity-20"/><p className="text-sm">No courses yet.</p><Button variant="outline" size="sm" className="mt-3" asChild><Link to="/courses">Browse courses</Link></Button></Card>
            ) : courses.map(c => (
              <Link key={c._id} to={`/courses/${c._id}`}>
                <Card className="card-hover overflow-hidden h-full group">
                  <div className="aspect-video bg-muted overflow-hidden">
                    {c.coverImage ? <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5"><BookOpen className="w-8 h-8 text-primary/30"/></div>}
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex gap-2"><Badge variant="secondary" className="capitalize text-[10px]">{c.level}</Badge>{c.isFree && <Badge variant="success" className="text-[10px]">Free</Badge>}</div>
                    <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.totalLessons} lessons · {c.enrollmentCount||0} enrolled</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Open for Registration</h2>
          <Button variant="ghost" size="sm" asChild className="text-primary"><Link to="/competitions">View all <ArrowRight className="w-3.5 h-3.5"/></Link></Button>
        </div>
        {competitions.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground"><Trophy className="w-8 h-8 mx-auto mb-2 opacity-20"/><p className="text-sm">No open competitions right now.</p></Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitions.map(c => (
              <Link key={c._id} to={`/competitions/${c._id}`}>
                <Card className="card-hover p-4 space-y-3 h-full group">
                  <Badge variant="success" className="text-[10px]">Registration open</Badge>
                  <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{c.title}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3"/>Starts: {formatDate(c.startDate)}</p>
                    <p className="text-destructive font-medium">Reg. closes: {formatDate(c.registrationDeadline)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}