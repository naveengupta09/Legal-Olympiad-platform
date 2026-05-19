import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, BookOpen, Trophy, Calendar, Mic2, GraduationCap, User, Building2, Loader2 } from "lucide-react";
import { searchApi } from "@/api/search.api";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const TYPE_ICON = {
    content: BookOpen,
    blog: BookOpen,
    article: BookOpen,
    news: BookOpen,
    competition: Trophy,
    webinar: Calendar,
    podcast: Mic2,
    course: GraduationCap,
    user: User,
    college: Building2,
};

const TYPE_ROUTE = {
    content: (item) => `/blogs/${item.slug || item._id}`,
    blog: (item) => `/blogs/${item.slug || item._id}`,
    article: (item) => `/blogs/${item.slug || item._id}`,
    news: (item) => `/blogs/${item.slug || item._id}`,
    competition: (item) => `/competitions/${item._id}`,
    webinar: (item) => `/webinars/${item._id}`,
    podcast: (item) => `/podcasts/${item._id}`,
    course: (item) => `/courses/${item._id}`,
    user: (item) => `/profile/${item._id}`,
    college: (item) => `/colleges/${item._id}`,
};

export default function GlobalSearch({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const debounced = useDebounce(query, 300);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    // Keyboard shortcut: Ctrl+K / Cmd+K
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                isOpen ? onClose() : null;
            }
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // Fetch search results
    useEffect(() => {
        if (!debounced || debounced.length < 2) { setResults([]); return; }
        setLoading(true);
        searchApi.global(debounced, { limit: 4 })
            .then((res) => { setResults(res.data?.results || []); setSelected(0); })
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, [debounced]);

    // Keyboard navigation
    const handleKey = (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
        if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
        if (e.key === "Enter" && results[selected]) {
            navigate(TYPE_ROUTE[results[selected]._type]?.(results[selected]) || "/");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-xl bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    {loading ? <Loader2 className="w-5 h-5 text-muted-foreground animate-spin shrink-0" />
                        : <Search className="w-5 h-5 text-muted-foreground shrink-0" />}
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Search competitions, blogs, courses…"
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border rounded font-mono">ESC</kbd>
                </div>

                {/* Results */}
                {results.length > 0 && (
                    <div className="max-h-80 overflow-y-auto">
                        {results.map((item, i) => {
                            const Icon = TYPE_ICON[item._type] || BookOpen;
                            const route = TYPE_ROUTE[item._type]?.(item) || "/";
                            return (
                                <button key={`${item._type}-${item._id}`}
                                    onClick={() => { navigate(route); onClose(); }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                                        i === selected ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                                    )}>
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.title || item.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{item._type}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Empty state */}
                {query.length >= 2 && !loading && results.length === 0 && (
                    <div className="py-10 text-center text-muted-foreground text-sm">
                        No results for "{query}"
                    </div>
                )}

                {/* Hint */}
                {!query && (
                    <div className="px-4 py-4 text-xs text-muted-foreground space-y-1">
                        <p>Search competitions, blogs, courses, webinars, podcasts, colleges…</p>
                    </div>
                )}
            </div>
        </div>
    );
}