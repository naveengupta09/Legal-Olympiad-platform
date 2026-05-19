import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, Clock, Search, Heart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useContentList } from "@/hooks/useContent";
import { useDebounce } from "@/hooks/useDebounce";
import { formatRelative } from "@/utils/formatDate";

const TYPES = [
  { value: "", label: "All" },
  { value: "blog", label: "Blogs" },
  { value: "article", label: "Articles" },
  { value: "news", label: "News" },
  { value: "update", label: "Updates" },
];

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "liked", label: "Most liked" },
];

function ContentCard({ post, featured = false }) {
  return (
    <Link to={`/blogs/${post.slug}`} className={featured ? "col-span-full" : ""}>
      <Card className={`h-full card-hover overflow-hidden group ${featured ? "flex flex-col md:flex-row" : ""}`}>
        <div className={`bg-muted overflow-hidden ${featured ? "md:w-2/5 aspect-video md:aspect-auto" : "aspect-[16/9]"}`}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary/30" />
            </div>
          )}
        </div>
        <CardContent className={`flex flex-col justify-between ${featured ? "flex-1 p-7" : "p-5"} space-y-3`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wide capitalize">{post.type}</Badge>
              {post.tags?.slice(0, 2).map(tag => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}
            </div>
            <h3 className={`font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors ${featured ? "text-2xl" : "text-lg"}`}>
              {post.title}
            </h3>
            {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6"><AvatarImage src={post.author?.avatar} /><AvatarFallback className="text-[10px]">{post.author?.name?.[0]}</AvatarFallback></Avatar>
              <span className="text-xs text-muted-foreground">{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min</span>
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes?.length || 0}</span>
              <span>{formatRelative(post.publishedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function BlogsPage() {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get("type") || "");
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 400);

  useEffect(() => {
    const t = searchParams.get("type");
    if (t) setType(t);
  }, [searchParams]);

  const { data, isLoading } = useContentList({ type: type || undefined, sort, search: debounced || undefined, page, limit: 9 });
  const posts = data?.data || [];
  const pagination = data?.pagination;
  const [featured, ...rest] = posts;

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <p className="section-label">Knowledge Hub</p>
        <h1 className="font-display text-4xl font-bold">Blogs & Articles</h1>
        <p className="text-muted-foreground">Insights, analysis, and commentary from the legal community.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search articles…" className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map(t => (
            <Button key={t.value} size="sm" variant={type === t.value ? "default" : "outline"} onClick={() => { setType(t.value); setPage(1); }} className="rounded-full">{t.label}</Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Sort by:</span>
        {SORTS.map(s => (
          <Button key={s.value} size="sm" variant={sort === s.value ? "secondary" : "ghost"} onClick={() => setSort(s.value)} className="text-xs h-7 px-3">{s.label}</Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full rounded-none" />
              <CardContent className="p-5 space-y-3"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-full" /><Skeleton className="h-5 w-4/5" /><Separator /><div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-20" /></div></CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground space-y-3">
          <BookOpen className="w-12 h-12 mx-auto opacity-20" /><p>No content found. Try a different filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {page === 1 && featured && <ContentCard post={featured} featured />}
          {(page === 1 ? rest : posts).map(post => <ContentCard key={post._id} post={post} />)}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground px-3">Page {page} of {pagination.totalPages}</span>
          <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}