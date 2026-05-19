import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Users, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCollege } from "@/hooks/useColleges";
import { formatScore, getRankLabel } from "@/utils/formatScore";
import { QueryError, InlineLoader } from "@/components/QueryState";

export default function CollegeDetailPage() {
  const { id } = useParams();
  const { data: college, isLoading, isError, refetch } = useCollege(id);

  if (isLoading) return <div className="container py-12"><InlineLoader /></div>;
  if (isError) return <div className="container py-12"><QueryError onRetry={refetch} /></div>;
  if (!college) return <div className="container py-24 text-center text-muted-foreground">College not found.</div>;

  return (
    <div className="container py-12 space-y-8">
      <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
        <Link to="/colleges"><ArrowLeft className="w-4 h-4" /> Back to colleges</Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 p-8 text-center space-y-4 shadow-md border-border/60">
          <div className="w-24 h-24 rounded-2xl border border-border bg-muted overflow-hidden mx-auto flex items-center justify-center">
            {college.logo ? (
              <img src={college.logo} alt={college.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl">{college.name}</h1>
            {college.isVerified && (
              <Badge variant="secondary" className="mt-2 gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </Badge>
            )}
          </div>
          {college.location && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4" />
              {college.location.city}, {college.location.state}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="font-display text-2xl text-primary">{college.rank ? getRankLabel(college.rank) : "—"}</p>
              <p className="text-xs text-muted-foreground">Rank</p>
            </div>
            <div>
              <p className="font-display text-2xl">{formatScore(college.totalScore || 0)}</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {college.description && (
            <Card className="p-6 shadow-sm">
              <h2 className="font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{college.description}</p>
            </Card>
          )}

          {college.affiliatedStudents?.length > 0 && (
            <Card className="p-6 shadow-sm">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Students ({college.affiliatedStudents.length})
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {college.affiliatedStudents.map((s) => (
                  <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/30">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={s.avatar} />
                      <AvatarFallback>{s.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {formatScore(s.totalScore || 0)} pts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

