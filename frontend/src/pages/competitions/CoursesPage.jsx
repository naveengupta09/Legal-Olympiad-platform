import { useState } from "react";
import { BookOpen, Clock, Star, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/hooks/useCourses";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDuration } from "@/utils/formatDate";

const LEVELS = [["","All"],["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]];

export default function CoursesPage() {
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const db = useDebounce(search, 400);
  const { data, isLoading } = useCourses({ level: level||undefined, search: db||undefined, limit: 12 });
  const courses = data?.data || [];

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <p className="section-label">Keep Learning</p>
        <h1 className="font-display text-4xl font-bold">Courses</h1>
        <p className="text-muted-foreground">Structured learning paths built by top legal practitioners.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {LEVELS.map(([v,l]) => (
            <Button key={v} size="sm" variant={level===v?"default":"outline"} onClick={() => setLevel(v)} className="rounded-full">{l}</Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({length:6}).map((_,i) => <Card key={i}><Skeleton className="aspect-video w-full rounded-none" /><CardContent className="p-5 space-y-2"><Skeleton className="h-5 w-full" /><Skeleton className="h-4 w-2/3" /></CardContent></Card>)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>No courses found.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => (
            <Link key={c._id} to={`/courses/${c._id}`}>
              <Card className="h-full card-hover overflow-hidden group">
                <div className="aspect-video bg-muted overflow-hidden">
                  {c.coverImage
                    ? <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"><BookOpen className="w-10 h-10 text-primary/30" /></div>}
                </div>
                <CardContent className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="capitalize text-[10px]">{c.level}</Badge>
                    {c.isFree ? <Badge variant="success" className="text-[10px]">Free</Badge> : <Badge variant="outline" className="text-[10px]">₹{c.price}</Badge>}
                  </div>
                  <h3 className="font-display font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">{c.title}</h3>
                  {c.shortDescription && <p className="text-sm text-muted-foreground line-clamp-2">{c.shortDescription}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(c.totalDuration)}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{c.totalLessons} lessons</span>
                    {c.rating > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{c.rating.toFixed(1)}</span>}
                  </div>
                  {c.instructor && (
                    <div className="flex items-center gap-2 pt-1 border-t border-border">
                      <Avatar className="w-5 h-5"><AvatarImage src={c.instructor.avatar} /><AvatarFallback className="text-[8px]">{c.instructor.name?.[0]}</AvatarFallback></Avatar>
                      <span className="text-xs text-muted-foreground">{c.instructor.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{c.enrollmentCount || 0}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}