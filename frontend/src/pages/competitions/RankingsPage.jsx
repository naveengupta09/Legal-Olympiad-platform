import { useState } from "react";
import { Users, Building2, TrendingUp, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useStudentLeaderboard, useCollegeLeaderboard } from "@/hooks/useRankings";
import { formatScore, getRankLabel } from "@/utils/formatScore";
import { cn } from "@/lib/utils";

const PERIODS = [
  { value: "all_time",  label: "All time"  },
  { value: "monthly",   label: "Monthly"   },
  { value: "quarterly", label: "Quarterly" },
];

function PodiumCard({ entity, rank, isCollege }) {
  const colors = { 1: "bg-yellow-500/10 border-yellow-400/30", 2: "bg-slate-400/10 border-slate-400/30", 3: "bg-amber-500/10 border-amber-400/30" };
  const labelColors = { 1: "text-yellow-600", 2: "text-slate-500", 3: "text-amber-600" };
  const heights = { 1: "h-32", 2: "h-24", 3: "h-20" };
  return (
    <div className={cn("flex-1 flex flex-col items-center gap-3", rank === 1 ? "order-2" : rank === 2 ? "order-1" : "order-3")}>
      <Avatar className={cn("ring-2", rank===1?"ring-yellow-400 w-16 h-16":rank===2?"ring-slate-400 w-12 h-12":"ring-amber-500 w-12 h-12")}>
        {isCollege
          ? entity.logo ? <img src={entity.logo} alt={entity.name} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6" />
          : <><AvatarImage src={entity.avatar} /><AvatarFallback>{entity.name?.[0]}</AvatarFallback></>}
      </Avatar>
      <div className="text-center">
        <p className="font-semibold text-sm line-clamp-1">{entity.name}</p>
        <p className="text-xs text-muted-foreground">{formatScore(entity.totalScore)} pts</p>
      </div>
      <div className={cn("w-full rounded-t-lg flex items-center justify-center font-display text-3xl font-bold border", colors[rank], labelColors[rank], heights[rank])}>
        {getRankLabel(rank)}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, rank, isCollege }) {
  const rankColors = { 1: "rank-1", 2: "rank-2", 3: "rank-3" };
  const entity = isCollege ? entry.entity : entry.entity;
  if (!entity) return null;
  const to = isCollege ? `/colleges/${entity._id}` : `/profile/${entity._id}`;
  return (
    <Link to={to} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group border-b border-border last:border-0">
      <span className={cn("w-10 text-center font-bold font-mono text-sm shrink-0", rankColors[rank] || "text-muted-foreground")}>
        {getRankLabel(rank)}
      </span>
      {isCollege ? (
        <div className="w-9 h-9 rounded-lg bg-muted overflow-hidden flex items-center justify-center shrink-0">
          {entity.logo ? <img src={entity.logo} alt={entity.name} className="w-full h-full object-cover" /> : <Building2 className="w-4 h-4 text-muted-foreground" />}
        </div>
      ) : (
        <Avatar className="w-9 h-9 shrink-0">
          <AvatarImage src={entity.avatar} />
          <AvatarFallback>{entity.name?.[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{entity.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {isCollege
            ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{entity.location?.city}, {entity.location?.state}</span>
            : entity.college?.name || "Independent"}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-sm text-primary">{formatScore(entry.score)}</p>
        <p className="text-xs text-muted-foreground">pts</p>
      </div>
      {entry.previousRank && (
        <div className={cn("text-xs font-medium shrink-0", entry.rank < entry.previousRank ? "text-green-500" : "text-destructive")}>
          {entry.rank < entry.previousRank ? "↑" : "↓"}{Math.abs(entry.rank - entry.previousRank)}
        </div>
      )}
    </Link>
  );
}

export default function RankingsPage() {
  const [period, setPeriod] = useState("all_time");
  const [page, setPage] = useState(1);

  const { data: studentsData, isLoading: studentsLoading } = useStudentLeaderboard({ period, page, limit: 20 });
  const { data: collegesData, isLoading: collegesLoading } = useCollegeLeaderboard({ period, page, limit: 20 });

  const students = studentsData?.data || [];
  const colleges = collegesData?.data || [];

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <p className="section-label">Compete & Rise</p>
        <h1 className="font-display text-4xl font-bold">Rankings</h1>
        <p className="text-muted-foreground">See where you stand among India's best law students and colleges.</p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {PERIODS.map(p => (
          <Button key={p.value} size="sm" variant={period === p.value ? "default" : "outline"}
            onClick={() => { setPeriod(p.value); setPage(1); }} className="rounded-full">
            {p.label}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students" className="gap-2"><Users className="w-4 h-4" />Students</TabsTrigger>
          <TabsTrigger value="colleges" className="gap-2"><Building2 className="w-4 h-4" />Colleges</TabsTrigger>
        </TabsList>

        {/* Students */}
        <TabsContent value="students" className="space-y-6 mt-6">
          {/* Podium */}
          {!studentsLoading && students.length >= 3 && (
            <Card className="p-8 overflow-hidden">
              <div className="flex items-end gap-4 max-w-sm mx-auto">
                {[1,2,3].map(r => {
                  const entry = students[r-1];
                  return entry?.entity ? <PodiumCard key={r} entity={entry.entity} rank={r} isCollege={false} /> : null;
                })}
              </div>
            </Card>
          )}
          <Card>
            {studentsLoading
              ? Array.from({length:10}).map((_,i) => <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border"><Skeleton className="w-10 h-4" /><Skeleton className="w-9 h-9 rounded-full" /><div className="flex-1"><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-24" /></div><Skeleton className="h-4 w-16" /></div>)
              : students.length === 0
                ? <div className="py-16 text-center text-muted-foreground">No rankings yet — be the first to compete!</div>
                : students.map((entry, i) => <LeaderboardRow key={entry._id} entry={entry} rank={i + 1 + (page-1)*20} isCollege={false} />)}
          </Card>
        </TabsContent>

        {/* Colleges */}
        <TabsContent value="colleges" className="space-y-6 mt-6">
          {!collegesLoading && colleges.length >= 3 && (
            <Card className="p-8">
              <div className="flex items-end gap-4 max-w-sm mx-auto">
                {[1,2,3].map(r => {
                  const entry = colleges[r-1];
                  return entry?.entity ? <PodiumCard key={r} entity={entry.entity} rank={r} isCollege /> : null;
                })}
              </div>
            </Card>
          )}
          <Card>
            {collegesLoading
              ? Array.from({length:10}).map((_,i) => <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border"><Skeleton className="w-10 h-4" /><Skeleton className="w-9 h-9 rounded-lg" /><div className="flex-1"><Skeleton className="h-4 w-40 mb-1" /><Skeleton className="h-3 w-28" /></div><Skeleton className="h-4 w-16" /></div>)
              : colleges.length === 0
                ? <div className="py-16 text-center text-muted-foreground">No college rankings yet.</div>
                : colleges.map((entry, i) => <LeaderboardRow key={entry._id} entry={entry} rank={i + 1 + (page-1)*20} isCollege />)}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}