import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Users, Building2, Mic2, BookOpen, Calendar, Newspaper, Star, TrendingUp, Play, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useHomepageFeed } from "@/hooks/useHomepage";
import { useAuthStore } from "@/store/authStore";
import { formatDate, formatRelative, formatDuration } from "@/utils/formatDate";
import { formatScore, getRankLabel } from "@/utils/formatScore";
import { cn } from "@/lib/utils";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ stats }) {
  const { isLoggedIn } = useAuthStore();
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[.03]"
          style={{ backgroundImage: "radial-gradient(circle,#000 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="container py-24 lg:py-36">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wide">
            <Star className="w-3 h-3 fill-primary" /> India's #1 Legal Learning Platform
          </Badge>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05]">
            Compete. Learn.{" "}
            <span className="text-primary italic">Excel.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join thousands of law students in moot courts, quizzes, and legal olympiads. Build your ranking, earn recognition, and unlock your legal career.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isLoggedIn() ? (
              <Button size="lg" asChild className="rounded-xl">
                <Link to="/competitions">Browse competitions <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild className="rounded-xl">
                  <Link to="/register">Get started free <ArrowRight className="w-4 h-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-xl">
                  <Link to="/competitions">Explore competitions</Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats bar */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/60 animate-fade-in">
              {[
                { label: "Students",     value: stats.totalStudents,    icon: Users      },
                { label: "Colleges",     value: stats.totalColleges,    icon: Building2  },
                { label: "Competitions", value: stats.totalCompetitions, icon: Trophy    },
                { label: "Webinars",     value: stats.totalWebinars,    icon: Calendar   },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center space-y-1">
                  <p className="font-display text-3xl font-bold text-foreground animate-count-up">
                    {value >= 1000 ? `${(value/1000).toFixed(1)}k+` : `${value}+`}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Announcement ticker ───────────────────────────────────────────────────────
function Ticker({ updates }) {
  if (!updates?.length) return null;
  const items = [...updates, ...updates];
  return (
    <div className="border-y border-border bg-primary/5 overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold tracking-widest uppercase">
          Updates
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-12 animate-ticker whitespace-nowrap py-2.5 px-6">
            {items.map((u, i) => (
              <span key={i} className="text-sm text-foreground/80 shrink-0">
                <span className="text-primary font-semibold mr-2">•</span>
                {u.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ label, title, subtitle, href, linkText = "View all" }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div className="space-y-1.5">
        {label && <p className="section-label">{label}</p>}
        <h2 className="font-display text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>
      {href && (
        <Button variant="ghost" size="sm" asChild className="text-primary shrink-0">
          <Link to={href}>{linkText} <ArrowRight className="w-3.5 h-3.5" /></Link>
        </Button>
      )}
    </div>
  );
}

// ─── Blog card ─────────────────────────────────────────────────────────────────
function BlogCard({ post }) {
  return (
    <Link to={`/blogs/${post.slug}`}>
      <Card className="h-full card-hover overflow-hidden group">
        <div className="aspect-[16/9] bg-muted overflow-hidden">
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary/30" />
            </div>
          )}
        </div>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">{post.type}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />{post.readTime} min read
            </span>
          </div>
          <h3 className="font-display font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
          {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
          <div className="flex items-center gap-2 pt-1">
            <Avatar className="w-6 h-6">
              <AvatarImage src={post.author?.avatar} />
              <AvatarFallback className="text-[10px]">{post.author?.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{post.author?.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">{formatRelative(post.publishedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Competition card ──────────────────────────────────────────────────────────
function CompetitionCard({ comp }) {
  const statusColors = {
    upcoming:          "secondary",
    registration_open: "success",
    ongoing:           "warning",
    completed:         "outline",
  };
  return (
    <Link to={`/competitions/${comp._id}`}>
      <Card className="h-full card-hover overflow-hidden group">
        <div className="aspect-video bg-muted overflow-hidden relative">
          {comp.coverImage
            ? <img src={comp.coverImage} alt={comp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="w-full h-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center"><Trophy className="w-10 h-10 text-primary/30" /></div>
          }
          <Badge variant={statusColors[comp.status] || "secondary"} className="absolute top-3 left-3 capitalize text-[10px]">
            {comp.status?.replace("_", " ")}
          </Badge>
        </div>
        <CardContent className="p-5 space-y-3">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{comp.type?.replace("_"," ")}</Badge>
          <h3 className="font-display font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">{comp.title}</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(comp.startDate)}</span>
            {comp.prizePool > 0 && <span className="text-yellow-600 font-semibold">₹{formatScore(comp.prizePool)} prize</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Webinar card ──────────────────────────────────────────────────────────────
function WebinarCard({ webinar }) {
  const isLive = webinar.status === "live";
  return (
    <Link to={`/webinars/${webinar._id}`}>
      <Card className="h-full card-hover p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            {isLive && <Badge variant="live" className="mb-1.5 text-[10px]">● LIVE NOW</Badge>}
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{webinar.title}</h3>
          </div>
        </div>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{formatDate(webinar.scheduledAt)} · {formatDuration(webinar.durationMinutes)}</p>
          {webinar.host && (
            <p className="flex items-center gap-1.5">
              <Avatar className="w-4 h-4"><AvatarImage src={webinar.host.avatar} /><AvatarFallback className="text-[8px]">{webinar.host.name?.[0]}</AvatarFallback></Avatar>
              {webinar.host.name}
            </p>
          )}
        </div>
        {webinar.certificateProvided && <Badge variant="gold" className="text-[10px]">Certificate</Badge>}
      </Card>
    </Link>
  );
}

// ─── Podcast card ──────────────────────────────────────────────────────────────
function PodcastCard({ podcast }) {
  return (
    <Link to={`/podcasts/${podcast._id}`}>
      <Card className="card-hover overflow-hidden group">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
            {podcast.coverImage
              ? <img src={podcast.coverImage} alt={podcast.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Mic2 className="w-6 h-6 text-muted-foreground" /></div>}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">EP {podcast.episodeNumber}</p>
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{podcast.title}</h3>
            <p className="text-xs text-muted-foreground">{formatDuration(Math.floor(podcast.duration / 60))}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Rankings table ────────────────────────────────────────────────────────────
function RankingsSection({ topStudents, topColleges }) {
  return (
    <section className="container py-16">
      <SectionHeader label="Leaderboard" title="Rankings" subtitle="Top performers this season" href="/rankings" />
      <Tabs defaultValue="students">
        <TabsList className="mb-6">
          <TabsTrigger value="students" className="gap-2"><Users className="w-4 h-4" />Students</TabsTrigger>
          <TabsTrigger value="colleges" className="gap-2"><Building2 className="w-4 h-4" />Colleges</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Card>
            <div className="divide-y divide-border">
              {topStudents?.map((student, i) => (
                <Link key={student._id} to={`/profile/${student._id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group">
                  <span className={cn("w-8 text-center font-bold font-mono text-sm", i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":"text-muted-foreground")}>
                    {getRankLabel(i+1)}
                  </span>
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.college?.name || "Independent"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">{formatScore(student.totalScore)}</p>
                    <p className="text-xs text-muted-foreground">pts</p>
                  </div>
                </Link>
              ))}
              {!topStudents?.length && (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">No rankings yet. Be the first to compete!</div>
              )}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="colleges">
          <Card>
            <div className="divide-y divide-border">
              {topColleges?.map((college, i) => (
                <Link key={college._id} to={`/colleges/${college._id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group">
                  <span className={cn("w-8 text-center font-bold font-mono text-sm", i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":"text-muted-foreground")}>
                    {getRankLabel(i+1)}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-muted overflow-hidden flex items-center justify-center shrink-0">
                    {college.logo ? <img src={college.logo} alt={college.name} className="w-full h-full object-cover" />
                      : <Building2 className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{college.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{college.location?.city}, {college.location?.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">{formatScore(college.totalScore)}</p>
                    <p className="text-xs text-muted-foreground">{college.stats?.totalStudents || 0} students</p>
                  </div>
                </Link>
              ))}
              {!topColleges?.length && (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">No college rankings yet.</div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

// ─── News section ──────────────────────────────────────────────────────────────
function NewsSection({ news }) {
  if (!news?.length) return null;
  const [featured, ...rest] = news;
  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        <SectionHeader label="Latest" title="News & Updates" href="/blogs?type=news" />
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured news */}
          <Link to={`/blogs/${featured.slug}`} className="lg:col-span-2">
            <Card className="h-full card-hover overflow-hidden group">
              <div className="aspect-[16/7] bg-muted overflow-hidden">
                {featured.coverImage
                  ? <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"><Newspaper className="w-12 h-12 text-primary/20" /></div>}
              </div>
              <CardContent className="p-6 space-y-3">
                <Badge variant="secondary" className="text-[10px] uppercase">News</Badge>
                <h3 className="font-display text-2xl font-bold line-clamp-2 group-hover:text-primary transition-colors">{featured.title}</h3>
                {featured.excerpt && <p className="text-muted-foreground text-sm line-clamp-2">{featured.excerpt}</p>}
                <p className="text-xs text-muted-foreground">{formatRelative(featured.publishedAt)}</p>
              </CardContent>
            </Card>
          </Link>
          {/* Side news */}
          <div className="space-y-4">
            {rest.slice(0,4).map(item => (
              <Link key={item._id} to={`/blogs/${item.slug}`}>
                <Card className="card-hover p-4 group">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">{formatRelative(item.publishedAt)}</p>
                    <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{item.title}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner() {
  const { isLoggedIn } = useAuthStore();
  if (isLoggedIn()) return null;
  return (
    <section className="container py-16">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-10 lg:p-16 text-center text-white">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)",backgroundSize:"30px 30px"}} />
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="font-display text-4xl lg:text-5xl font-bold">Ready to compete?</h2>
          <p className="text-white/80 text-lg">Join 12,000+ law students already building their legal careers on Legal Olympiad.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="gold" asChild className="rounded-xl">
              <Link to="/register">Get started for free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button size="lg" asChild className="rounded-xl bg-white/10 text-white hover:bg-white/20 border-white/20 border">
              <Link to="/competitions">Browse competitions</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <section className="container py-24 lg:py-36">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-4/5 mx-auto" />
        <Skeleton className="h-5 w-2/3 mx-auto" />
        <div className="flex gap-3 justify-center">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </section>
  );
}

function CardGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full rounded-none" />
          <CardContent className="p-5 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: feed, isLoading, error } = useHomepageFeed();

  if (error) return (
    <div className="container py-24 text-center space-y-4">
      <p className="text-muted-foreground">Unable to load content. Please check your connection.</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );

  const { stats, featuredBlogs, latestNews, latestUpdates, upcomingWebinars,
          featuredPodcasts, upcomingCompetitions, rankings, recentParticipants } = feed || {};

  return (
    <div className="space-y-0">
      {/* Hero */}
      {isLoading ? <HeroSkeleton /> : <Hero stats={stats} />}

      {/* Ticker */}
      <Ticker updates={latestUpdates} />

      {/* Competitions */}
      <section className="container py-16">
        <SectionHeader label="Don't miss out" title="Active Competitions" subtitle="Register before deadlines close" href="/competitions" />
        {isLoading ? <CardGridSkeleton count={4} /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {upcomingCompetitions?.map(c => <CompetitionCard key={c._id} comp={c} />)}
            {!upcomingCompetitions?.length && (
              <div className="col-span-4 text-center py-12 text-muted-foreground text-sm">No upcoming competitions. Check back soon!</div>
            )}
          </div>
        )}
      </section>

      {/* Rankings */}
      <div className="bg-muted/30">
        {isLoading ? (
          <div className="container py-16"><Skeleton className="h-96 w-full" /></div>
        ) : (
          <RankingsSection topStudents={rankings?.topStudents} topColleges={rankings?.topColleges} />
        )}
      </div>

      {/* Webinars */}
      <section className="container py-16">
        <SectionHeader label="Learn from experts" title="Upcoming Webinars & Seminars" href="/webinars" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({length:4}).map((_,i)=><Card key={i} className="p-5"><Skeleton className="h-28 w-full" /></Card>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingWebinars?.map(w => <WebinarCard key={w._id} webinar={w} />)}
            {!upcomingWebinars?.length && (
              <div className="col-span-4 text-center py-12 text-muted-foreground text-sm">No upcoming webinars scheduled.</div>
            )}
          </div>
        )}
      </section>

      {/* News */}
      {isLoading ? (
        <div className="bg-muted/30 py-16"><div className="container"><Skeleton className="h-72 w-full" /></div></div>
      ) : (
        <NewsSection news={latestNews} />
      )}

      {/* Blogs */}
      <section className="container py-16">
        <SectionHeader label="From the community" title="Featured Articles" href="/blogs" />
        {isLoading ? <CardGridSkeleton count={4} /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredBlogs?.map(post => <BlogCard key={post._id} post={post} />)}
            {!featuredBlogs?.length && (
              <div className="col-span-4 text-center py-12 text-muted-foreground text-sm">No articles published yet.</div>
            )}
          </div>
        )}
      </section>

      {/* Podcasts */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <SectionHeader label="On air" title="Featured Podcasts" href="/podcasts" />
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({length:3}).map((_,i)=><Card key={i} className="p-4"><Skeleton className="h-16 w-full" /></Card>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPodcasts?.map(p => <PodcastCard key={p._id} podcast={p} />)}
              {!featuredPodcasts?.length && (
                <div className="col-span-3 text-center py-12 text-muted-foreground text-sm">No podcasts published yet.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* New participants */}
      {recentParticipants?.newStudents?.length > 0 && (
        <section className="container py-16">
          <SectionHeader label="Welcome" title="New Members" subtitle="Recently joined the platform" />
          <div className="flex flex-wrap gap-4">
            {recentParticipants.newStudents.map(s => (
              <div key={s._id} className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/50 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={s.avatar} />
                  <AvatarFallback className="text-xs">{s.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.college?.name || "Student"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <CTABanner />
    </div>
  );
}