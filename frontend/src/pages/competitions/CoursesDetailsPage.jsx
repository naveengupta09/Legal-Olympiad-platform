import { useParams, Link } from "react-router-dom";
import { BookOpen, Clock, Star, Users, CheckCircle2, Loader2, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourse, useEnrollCourse } from "@/hooks/useCourses";
import { useAuthStore } from "@/store/authStore";
import { formatDuration } from "@/utils/formatDate";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { data: c, isLoading } = useCourse(id);
  const { mutate: enroll, isPending } = useEnrollCourse();
  const { user, isLoggedIn } = useAuthStore();
  const [expandedModule, setExpandedModule] = useState(0);

  if (isLoading) return <div className="container py-12"><Skeleton className="h-96 w-full" /></div>;
  if (!c) return <div className="container py-24 text-center text-muted-foreground">Course not found.</div>;

  const enrollment = c.enrollments?.find(e => e.user === user?._id || e.user?._id === user?._id);
  const isEnrolled = !!enrollment;

  return (
    <div className="container py-12 space-y-8">
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back to courses</Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
            {c.coverImage ? <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"><BookOpen className="w-16 h-16 text-primary/30" /></div>}
          </div>

          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="capitalize">{c.level}</Badge>
              {c.isFree ? <Badge variant="success">Free</Badge> : <Badge variant="outline">₹{c.price}</Badge>}
              {c.category && <Badge variant="outline" className="capitalize text-xs">{c.category.replace(/_/g," ")}</Badge>}
            </div>
            <h1 className="font-display text-3xl font-bold">{c.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{c.description}</p>
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatDuration(c.totalDuration)}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{c.totalLessons} lessons</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{c.enrollmentCount || 0} enrolled</span>
              {c.rating > 0 && <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{c.rating.toFixed(1)} ({c.reviewCount} reviews)</span>}
            </div>
          </div>

          {/* Progress */}
          {isEnrolled && (
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Your progress</span>
                  <span className="text-primary font-bold">{enrollment.progress || 0}%</span>
                </div>
                <Progress value={enrollment.progress || 0} />
                {enrollment.isCompleted && (
                  <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle2 className="w-4 h-4" />Course completed!</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Curriculum */}
          {c.modules?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Curriculum</CardTitle></CardHeader>
              <CardContent className="p-0">
                {c.modules.map((mod, mi) => (
                  <div key={mod._id} className="border-b border-border last:border-0">
                    <button onClick={() => setExpandedModule(expandedModule === mi ? -1 : mi)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors text-left">
                      <div>
                        <p className="font-semibold">{mod.title}</p>
                        <p className="text-xs text-muted-foreground">{mod.lessons?.length || 0} lessons</p>
                      </div>
                      {expandedModule === mi ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    {expandedModule === mi && (
                      <div className="divide-y divide-border bg-muted/20">
                        {mod.lessons?.map(lesson => (
                          <div key={lesson._id} className="flex items-center gap-3 px-6 py-3">
                            <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center shrink-0">
                              {enrollment?.completedLessons?.includes(lesson._id) && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                            </div>
                            <span className="text-sm flex-1">{lesson.title}</span>
                            {lesson.duration > 0 && <span className="text-xs text-muted-foreground">{formatDuration(Math.floor(lesson.duration/60))}</span>}
                            {lesson.isPreview && <Badge variant="outline" className="text-[10px]">Preview</Badge>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                {c.isFree ? <p className="font-display text-3xl font-bold text-green-600">Free</p>
                  : <p className="font-display text-3xl font-bold">₹{c.price}</p>}
              </div>
              <Separator />
              {isEnrolled ? (
                <div>
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium justify-center py-2 mb-3">
                    <CheckCircle2 className="w-4 h-4" />Already enrolled
                  </div>
                  <Button className="w-full" variant="outline">Continue learning</Button>
                </div>
              ) : !isLoggedIn() ? (
                <Button className="w-full" asChild><Link to="/login">Log in to enroll</Link></Button>
              ) : (
                <Button className="w-full" onClick={() => enroll(c._id)} disabled={isPending}>
                  {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Enrolling…</> : c.isFree ? "Enroll for free" : "Enroll now"}
                </Button>
              )}
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "Duration",     value: formatDuration(c.totalDuration) },
                  { label: "Lessons",      value: c.totalLessons },
                  { label: "Level",        value: c.level },
                  { label: "Language",     value: c.language || "English" },
                  { label: "Certificate",  value: c.certificateProvided ? "Yes" : "No" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium capitalize">{value}</span></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}