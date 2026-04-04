import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Search, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useColleges } from "@/hooks/useColleges";
import { useDebounce } from "@/hooks/useDebounce";
import { formatScore, getRankLabel } from "@/utils/formatScore";

export default function CollegesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rank");
  const debounced = useDebounce(search, 400);
  const { data, isLoading } = useColleges({ search: debounced || undefined, sort, limit: 16 });
  const colleges = data?.data || [];

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <p className="section-label">Institutions</p>
        <h1 className="font-display text-4xl font-bold">Colleges</h1>
        <p className="text-muted-foreground">Find and compare law colleges competing on Legal Olympiad.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search colleges…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[["rank","Top ranked"],["score","Highest score"],["students","Most students"]].map(([v,l]) => (
            <Button key={v} size="sm" variant={sort===v?"default":"outline"} onClick={() => setSort(v)} className="rounded-full">{l}</Button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({length:8}).map((_,i) => <Card key={i} className="p-5 space-y-3"><Skeleton className="w-16 h-16 rounded-xl mx-auto"/><Skeleton className="h-5 w-4/5 mx-auto"/><Skeleton className="h-4 w-2/3 mx-auto"/></Card>)}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground"><Building2 className="w-12 h-12 mx-auto mb-4 opacity-20"/><p>No colleges found.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {colleges.map((college) => (
            <Link key={college._id} to={`/colleges/${college._id}`}>
              <Card className="h-full card-hover p-5 text-center group space-y-4">
                <div className="relative mx-auto w-16 h-16 rounded-2xl border border-border bg-muted overflow-hidden flex items-center justify-center">
                  {college.logo ? <img src={college.logo} alt={college.name} className="w-full h-full object-cover"/> : <Building2 className="w-7 h-7 text-muted-foreground"/>}
                  {college.isVerified && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white"/></div>}
                </div>
                {college.rank && <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">{getRankLabel(college.rank)}</div>}
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{college.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><MapPin className="w-3 h-3"/>{college.location?.city}, {college.location?.state}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
                  <div><p className="font-bold text-primary">{formatScore(college.totalScore)}</p><p className="text-muted-foreground">Score</p></div>
                  <div><p className="font-bold">{college.stats?.totalStudents||0}</p><p className="text-muted-foreground">Students</p></div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}