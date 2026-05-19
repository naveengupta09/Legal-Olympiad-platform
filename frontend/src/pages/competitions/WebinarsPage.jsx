import { useState } from "react";
import { Calendar, Clock, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebinars } from "@/hooks/useWebinars";
import { formatDate, formatDurationMinutes } from "@/utils/formatDate";

export default function WebinarsPage() {
  const [status, setStatus] = useState("");
  const { data, isLoading } = useWebinars({ status: status || undefined, limit: 12 });
  const webinars = data?.data || [];

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <p className="section-label">Expert Knowledge</p>
        <h1 className="font-display text-4xl font-bold">Webinars & Seminars</h1>
        <p className="text-muted-foreground">Learn from practicing advocates, judges, and legal scholars.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[["","All"],["upcoming","Upcoming"],["live","Live Now"],["completed","Past"]].map(([v,l]) => (
          <Button key={v} size="sm" variant={status===v?"default":"outline"} onClick={() => setStatus(v)} className="rounded-full">
            {v==="live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />}{l}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({length:6}).map((_,i) => <Card key={i} className="p-5"><Skeleton className="h-40 w-full" /></Card>)}
        </div>
      ) : webinars.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground"><Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>No webinars found.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {webinars.map(w => (
            <Link key={w._id} to={`/webinars/${w._id}`}>
              <Card className="h-full card-hover overflow-hidden group">
                <div className="aspect-video bg-muted overflow-hidden relative">
                  {w.coverImage
                    ? <img src={w.coverImage} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"><Calendar className="w-10 h-10 text-primary/30" /></div>}
                  {w.status === "live" && (
                    <Badge variant="live" className="absolute top-3 left-3 text-[10px] gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />LIVE
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-display font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">{w.title}</h3>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{formatDate(w.scheduledAt)}</p>
                    <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{formatDurationMinutes(w.durationMinutes)}</p>
                    {w.host && (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="w-4 h-4"><AvatarImage src={w.host.avatar} /><AvatarFallback className="text-[8px]">{w.host.name?.[0]}</AvatarFallback></Avatar>
                        {w.host.name}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {w.certificateProvided && <Badge variant="gold" className="text-[10px]">Certificate</Badge>}
                    {w.tags?.slice(0,2).map(tag => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
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