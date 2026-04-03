import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Users, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate, formatScore } from "@/utils/formatDate";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { value: "",                  label: "All"          },
  { value: "upcoming",          label: "Upcoming"     },
  { value: "registration_open", label: "Register Now" },
  { value: "ongoing",           label: "Ongoing"      },
  { value: "completed",         label: "Completed"    },
];

const STATUS_COLORS = {
  upcoming:          "secondary",
  registration_open: "success",
  ongoing:           "warning",
  completed:         "outline",
  cancelled:         "destructive",
};

export default function CompetitionsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useCompetitions({
    status: status || undefined,
    search: debouncedSearch || undefined,
    limit: 12,
  });

  const competitions = data?.data || [];

  return (
    <div className="container py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="section-label">Compete & Grow</p>
        <h1 className="font-display text-4xl font-bold">Competitions</h1>
        <p className="text-muted-foreground">Moot courts, quizzes, essays, debates — find your arena.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search competitions…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(t => (
            <Button key={t.value} size="sm" variant={status === t.value ? "default" : "outline"}
              onClick={() => setStatus(t.value)} className="rounded-full">
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full rounded-none" />
              <CardContent className="p-5 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : competitions.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No competitions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map(comp => (
            <Link key={comp._id} to={`/competitions/${comp._id}`}>
              <Card className="h-full card-hover overflow-hidden group">
                <div className="aspect-video bg-muted overflow-hidden relative">
                  {comp.coverImage
                    ? <img src={comp.coverImage} alt={comp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center"><Trophy className="w-10 h-10 text-primary/30" /></div>}
                  <Badge variant={STATUS_COLORS[comp.status] || "secondary"} className="absolute top-3 left-3 text-[10px] capitalize">
                    {comp.status?.replace("_"," ")}
                  </Badge>
                  {comp.isFeatured && <Badge variant="gold" className="absolute top-3 right-3 text-[10px]">Featured</Badge>}
                </div>
                <CardContent className="p-5 space-y-3">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{comp.type?.replace(/_/g," ")}</Badge>
                  <h3 className="font-display font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">{comp.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(comp.startDate)}</span>
                    {comp.prizePool > 0 && <span className="text-yellow-600 font-semibold">₹{formatScore(comp.prizePool)}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reg. closes: <span className="font-medium text-foreground">{formatDate(comp.registrationDeadline)}</span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}