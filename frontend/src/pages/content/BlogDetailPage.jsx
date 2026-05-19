import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Eye, Clock, Calendar, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentBySlug, useToggleLike } from "@/hooks/useContent";
import { useAuthStore } from "@/store/authStore";
import { formatDate, formatRelative } from "@/utils/formatDate";
import toast from "react-hot-toast";

function ArticleSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-[16/6] w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  const { slug }             = useParams();
  const { user, isLoggedIn } = useAuthStore();
  const { data: post, isLoading } = useContentBySlug(slug);
  const { mutate: toggleLike, isPending: liking } = useToggleLike();

  const handleLike = () => {
    if (!isLoggedIn()) { toast.error("Log in to like articles"); return; }
    toggleLike(post._id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  if (isLoading) return (
    <div className="container py-12 max-w-4xl mx-auto">
      <Skeleton className="h-5 w-32 mb-8" />
      <ArticleSkeleton />
    </div>
  );

  if (!post) return (
    <div className="container py-24 text-center text-muted-foreground">Article not found.</div>
  );

  const hasLiked = post.likes?.includes(user?._id);

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back */}
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />Back to articles
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="aspect-[16/6] rounded-2xl overflow-hidden bg-muted">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-10">
          {/* Article */}
          <article className="lg:col-span-3 space-y-6">
            {/* Meta */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="uppercase text-[10px] tracking-wide">{post.type}</Badge>
                {post.tags?.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                ))}
              </div>

              <h1 className="font-display text-3xl lg:text-4xl font-bold leading-tight">{post.title}</h1>

              {post.excerpt && (
                <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 italic">
                  {post.excerpt}
                </p>
              )}

              {/* Author row */}
              <div className="flex items-center gap-4 py-4 border-y border-border">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback>{post.author?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{post.author?.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min read</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views?.toLocaleString()} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    disabled={liking}
                    className={hasLiked ? "text-red-500 hover:text-red-600" : ""}
                  >
                    {liking
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Heart className={`w-4 h-4 ${hasLiked ? "fill-red-500" : ""}`} />}
                    <span className="ml-1">{post.likes?.length || 0}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="pt-6 border-t border-border">
                <p className="text-sm font-medium mb-3">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link key={tag} to={`/blogs?tag=${tag}`}>
                      <Badge variant="outline" className="hover:bg-primary/5 hover:border-primary/50 cursor-pointer text-xs">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Author card */}
            <Card>
              <CardContent className="p-5 text-center space-y-3">
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback className="text-xl">{post.author?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author?.name}</p>
                  {post.author?.bio && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{post.author.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats card */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-sm font-semibold">Article stats</p>
                <Separator />
                {[
                  { icon: Eye,      label: "Views",     value: post.views?.toLocaleString() || 0 },
                  { icon: Heart,    label: "Likes",     value: post.likes?.length || 0 },
                  { icon: Clock,    label: "Read time", value: `${post.readTime} min` },
                  { icon: Calendar, label: "Published",  value: formatRelative(post.publishedAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />{label}
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-sm font-semibold">Share this article</p>
                <Button variant="outline" size="sm" className="w-full" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />Copy link
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}