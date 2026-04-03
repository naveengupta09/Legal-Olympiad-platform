import { useState } from "react";
import { Mic2, Play, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { usePodcasts } from "@/hooks/usePodcasts";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDuration } from "@/utils/formatDate";

export default function PodcastsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const { data, isLoading } = usePodcasts({ search: debouncedSearch || undefined, limit: 12 });
  const podcasts = data?.data || [];

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <p className="section-label">On Air</p>
        <h1 className="font-display text-4xl font-bold">Podcasts</h1>
        <p className="text-muted-foreground">In-depth legal conversations, case analyses, and career advice.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search episodes…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({length:6}).map((_,i) => <Card key={i} className="p-4"><Skeleton className="h-20 w-full" /></Card>)}
        </div>
      ) : podcasts.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground"><Mic2 className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>No podcasts found.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {podcasts.map(pod => (
            <Link key={pod._id} to={`/podcasts/${pod._id}`}>
              <Card className="card-hover overflow-hidden group h-full">
                <CardContent className="p-4 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                    {pod.coverImage
                      ? <img src={pod.coverImage} alt={pod.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Mic2 className="w-7 h-7 text-muted-foreground" /></div>}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">EP {pod.episodeNumber}</Badge>
                      {pod.tags?.[0] && <Badge variant="outline" className="text-[10px]">{pod.tags[0]}</Badge>}
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{pod.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {pod.host && (
                        <span className="flex items-center gap-1">
                          <Avatar className="w-3.5 h-3.5"><AvatarImage src={pod.host.avatar} /><AvatarFallback className="text-[8px]">{pod.host.name?.[0]}</AvatarFallback></Avatar>
                          {pod.host.name}
                        </span>
                      )}
                      <span>{formatDuration(Math.floor(pod.duration / 60))}</span>
                      <span>{pod.plays?.toLocaleString()} plays</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}