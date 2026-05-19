import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mic2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePodcast } from "@/hooks/usePodcasts";
import { formatDuration, formatRelative } from "@/utils/formatDate";
import { QueryError, InlineLoader } from "@/components/QueryState";

export default function PodcastDetailPage() {
  const { id } = useParams();
  const { data: pod, isLoading, isError, refetch } = usePodcast(id);

  if (isLoading) return <div className="container py-12"><InlineLoader /></div>;
  if (isError) return <div className="container py-12"><QueryError onRetry={refetch} /></div>;
  if (!pod) return <div className="container py-24 text-center text-muted-foreground">Episode not found.</div>;

  return (
    <div className="container py-12 space-y-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
        <Link to="/podcasts"><ArrowLeft className="w-4 h-4" /> Back to podcasts</Link>
      </Button>

      <Card className="overflow-hidden shadow-lg border-border/60">
        <CardContent className="p-8 space-y-6">
          <div className="flex gap-6 flex-col sm:flex-row">
            <div className="w-40 h-40 rounded-2xl bg-muted overflow-hidden shrink-0 mx-auto sm:mx-0">
              {pod.coverImage ? (
                <img src={pod.coverImage} alt={pod.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Mic2 className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="secondary">Episode {pod.episodeNumber}</Badge>
                {pod.tags?.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
              <h1 className="font-display text-3xl leading-tight">{pod.title}</h1>
              {pod.host && (
                <div className="flex items-center gap-2 justify-center sm:justify-start text-sm text-muted-foreground">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={pod.host.avatar} />
                    <AvatarFallback>{pod.host.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span>{pod.host.name}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center sm:justify-start">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(pod.duration)}
                </span>
                <span>{pod.plays?.toLocaleString() || 0} plays</span>
                {pod.publishedAt && <span>{formatRelative(pod.publishedAt)}</span>}
              </div>
            </div>
          </div>

          {pod.description && (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{pod.description}</p>
          )}

          {pod.audioUrl && (
            <audio controls className="w-full" src={pod.audioUrl}>
              Your browser does not support audio playback.
            </audio>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


