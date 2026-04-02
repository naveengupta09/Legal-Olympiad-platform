import {
	Bell,
	BookOpen,
	Building2,
	CalendarDays,
	GraduationCap,
	Mic,
	PlayCircle,
	TrendingUp,
	Trophy,
	Users,
} from 'lucide-react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const blogs = [
	{
		title: 'Drafting Better Legal Arguments in Moot Courts',
		tag: 'Blogs / Articles',
		readTime: '8 min read',
	},
	{
		title: '5 Internship Habits That Law Firms Value Most',
		tag: 'Blogs / Articles',
		readTime: '6 min read',
	},
	{
		title: 'From Classroom to Courtroom: Building Practical Skills',
		tag: 'Blogs / Articles',
		readTime: '10 min read',
	},
]

const webinars = [
	{
		title: 'IP Rights in the AI Era',
		speaker: 'Adv. Meera Narayanan',
		date: 'Apr 08, 2026',
	},
	{
		title: 'Litigation Strategy for Young Professionals',
		speaker: 'Sr. Counsel Rajat Bansal',
		date: 'Apr 12, 2026',
	},
	{
		title: 'Contract Drafting Masterclass',
		speaker: 'Prof. Ananya Sen',
		date: 'Apr 16, 2026',
	},
]

const news = [
	'National Mock Trial registrations close in 4 days.',
	'Supreme Court internship cohort list published.',
	'Campus legal innovation challenge now open for teams.',
]

const podcasts = [
	'Inside India Arbitration: Stories from Senior Counsels',
	'The Internship Playbook for Law Students',
	'Legal Research in the Age of AI',
]

const updates = [
	{
		title: 'New ranking algorithm released',
		detail: 'Performance now weighs consistency and peer benchmark scores.',
		date: '2 days ago',
	},
	{
		title: 'Achievement badges redesigned',
		detail: 'Students can now showcase gold-tier milestones on public profiles.',
		date: '5 days ago',
	},
	{
		title: 'Practice quiz analytics launched',
		detail: 'Track subject-level strengths with personalized suggestions.',
		date: '1 week ago',
	},
]

const participation = [
	{ college: 'NLSIU Bengaluru', students: 124, newJoiners: 28 },
	{ college: 'NLU Delhi', students: 111, newJoiners: 22 },
	{ college: 'Symbiosis Law School', students: 97, newJoiners: 31 },
]

const rankings = [
	{ rank: 1, college: 'NLSIU Bengaluru', score: 9840, trend: '+4.8%' },
	{ rank: 2, college: 'NLU Delhi', score: 9635, trend: '+3.1%' },
	{ rank: 3, college: 'NALSAR Hyderabad', score: 9442, trend: '+2.4%' },
	{ rank: 4, college: 'WBNUJS Kolkata', score: 9361, trend: '+2.0%' },
	{ rank: 5, college: 'GNLU Gandhinagar', score: 9247, trend: '+1.3%' },
]

function AuthActions({ clerkEnabled }) {
	if (!clerkEnabled) {
		return (
			<div className="flex items-center gap-2">
				<Badge variant="outline" className="border-amber-600/30 bg-amber-100 text-amber-900">
					Add VITE_CLERK_PUBLISHABLE_KEY to enable auth
				</Badge>
			</div>
		)
	}

	return (
		<>
			<SignedOut>
				<SignInButton mode="modal">
					<button className={buttonVariants({ variant: 'outline' })}>Sign In</button>
				</SignInButton>
				<SignInButton mode="modal">
					<button className={buttonVariants({ variant: 'default' })}>Get Started</button>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<div className="flex items-center gap-3">
					<Button variant="outline">Dashboard</Button>
					<UserButton afterSignOutUrl="/" />
				</div>
			</SignedIn>
		</>
	)
}

function App({ clerkEnabled = false }) {
	return (
		<div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
			<div className="hero-orb hero-orb-a" />
			<div className="hero-orb hero-orb-b" />

			<header className="sticky top-0 z-30 border-b border-slate-900/10 bg-slate-50/80 backdrop-blur-lg">
				<div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
					<div className="flex items-center gap-3">
						<div className="grid size-10 place-content-center rounded-xl bg-emerald-700 text-white shadow-md">
							<ScaleIcon />
						</div>
						<div>
							<p className="font-semibold tracking-tight">Legal Olympiad</p>
							<p className="text-xs text-slate-600">Learn. Compete. Rise.</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<AuthActions clerkEnabled={clerkEnabled} />
					</div>
				</div>
			</header>

			<main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-14 pt-8 md:gap-14 md:px-8 md:pt-12">
				<section className="animate-rise grid gap-6 rounded-3xl border border-slate-900/10 bg-gradient-to-br from-emerald-100 via-cyan-50 to-amber-50 p-6 shadow-xl md:grid-cols-[1.1fr_0.9fr] md:p-10" data-delay="0">
					<div className="space-y-5">
						<Badge className="bg-emerald-700 text-white hover:bg-emerald-700">National Legal Learning Network</Badge>
						<h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
							Build courtroom confidence through competitions, real internships, and ranked growth.
						</h1>
						<p className="max-w-xl text-sm text-slate-700 md:text-base">
							Legal Olympiad helps law students move from theoretical study to practical excellence with structured challenges, mentorship, and performance analytics.
						</p>
						<div className="flex flex-wrap gap-3">
							<Button className="bg-slate-900 text-white hover:bg-slate-800">Explore Competitions</Button>
							<Button variant="outline">View Rankings</Button>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 md:gap-4">
						{[
							['14.8k+', 'Active Students'],
							['620+', 'Colleges Engaged'],
							['180+', 'Live Activities'],
							['92%', 'Internship Completion'],
						].map(([value, label]) => (
							<Card key={label} className="bg-white/90 backdrop-blur">
								<CardContent className="space-y-1 py-5">
									<p className="text-2xl font-semibold text-slate-900">{value}</p>
									<p className="text-xs text-slate-600">{label}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className="animate-rise space-y-4" data-delay="1">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold tracking-tight">Learning & Media Hub</h2>
						<Badge variant="outline" className="border-emerald-700/20 bg-white">Fresh this week</Badge>
					</div>
					<Tabs defaultValue="blogs" className="w-full">
						<TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-white p-2 md:grid-cols-4">
							<TabsTrigger value="blogs" className="py-2">Blogs / Articles</TabsTrigger>
							<TabsTrigger value="webinars" className="py-2">Webinars & Seminars</TabsTrigger>
							<TabsTrigger value="news" className="py-2">News & Updates</TabsTrigger>
							<TabsTrigger value="podcasts" className="py-2">Podcasts</TabsTrigger>
						</TabsList>

						<TabsContent value="blogs" className="mt-4 grid gap-4 md:grid-cols-3">
							{blogs.map((item) => (
								<Card key={item.title} className="border-emerald-700/10">
									<CardHeader>
										<Badge className="w-fit bg-emerald-700 text-white hover:bg-emerald-700">{item.tag}</Badge>
										<CardTitle>{item.title}</CardTitle>
										<CardDescription>{item.readTime}</CardDescription>
									</CardHeader>
									<CardFooter className="justify-between">
										<span className="text-xs text-slate-500">Updated today</span>
										<BookOpen className="size-4 text-emerald-700" />
									</CardFooter>
								</Card>
							))}
						</TabsContent>

						<TabsContent value="webinars" className="mt-4 grid gap-4 md:grid-cols-3">
							{webinars.map((item) => (
								<Card key={item.title}>
									<CardHeader>
										<CardTitle>{item.title}</CardTitle>
										<CardDescription>{item.speaker}</CardDescription>
									</CardHeader>
									<CardFooter className="justify-between">
										<span className="inline-flex items-center gap-1 text-xs text-slate-600">
											<CalendarDays className="size-3.5" />
											{item.date}
										</span>
										<PlayCircle className="size-4 text-cyan-700" />
									</CardFooter>
								</Card>
							))}
						</TabsContent>

						<TabsContent value="news" className="mt-4 grid gap-4 md:grid-cols-3">
							{news.map((item) => (
								<Card key={item}>
									<CardHeader>
										<CardTitle className="text-base">{item}</CardTitle>
										<CardDescription className="inline-flex items-center gap-1">
											<Bell className="size-3.5" /> Breaking update
										</CardDescription>
									</CardHeader>
								</Card>
							))}
						</TabsContent>

						<TabsContent value="podcasts" className="mt-4 grid gap-4 md:grid-cols-3">
							{podcasts.map((item) => (
								<Card key={item}>
									<CardHeader>
										<CardTitle className="text-base">{item}</CardTitle>
									</CardHeader>
									<CardFooter className="justify-between">
										<span className="inline-flex items-center gap-1 text-xs text-slate-600">
											<Mic className="size-3.5" /> Episode live
										</span>
										<Button variant="outline" size="sm">Listen</Button>
									</CardFooter>
								</Card>
							))}
						</TabsContent>
					</Tabs>
				</section>

				<section className="animate-rise grid gap-4 md:grid-cols-2" data-delay="2">
					<Card className="bg-white">
						<CardHeader>
							<CardTitle className="inline-flex items-center gap-2">
								<TrendingUp className="size-5 text-cyan-700" /> Latest Platform Updates
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{updates.map((item) => (
								<div key={item.title} className="rounded-xl border border-slate-900/10 bg-slate-50 p-3">
									<div className="mb-1 flex items-center justify-between gap-2">
										<p className="text-sm font-medium">{item.title}</p>
										<span className="text-xs text-slate-500">{item.date}</span>
									</div>
									<p className="text-xs text-slate-600">{item.detail}</p>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="bg-white">
						<CardHeader>
							<CardTitle className="inline-flex items-center gap-2">
								<Users className="size-5 text-emerald-700" /> New Participation Highlights
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{participation.map((item) => (
								<div key={item.college} className="rounded-xl border border-slate-900/10 bg-slate-50 p-3">
									<p className="text-sm font-medium text-slate-900">{item.college}</p>
									<p className="text-xs text-slate-600">{item.students} active students</p>
									<p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
										<GraduationCap className="size-3.5" /> +{item.newJoiners} new participants this week
									</p>
								</div>
							))}
						</CardContent>
					</Card>
				</section>

				<section className="animate-rise space-y-4" data-delay="3">
					<div className="flex items-center justify-between">
						<h2 className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight">
							<Trophy className="size-6 text-amber-500" /> College Rankings
						</h2>
						<Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">Live leaderboard</Badge>
					</div>

					<Card className="overflow-hidden bg-white">
						<CardContent className="space-y-2 py-4">
							{rankings.map((item) => (
								<div key={item.college}>
									<div className="grid grid-cols-[40px_1fr_auto] items-center gap-2 rounded-xl p-2 hover:bg-slate-50 md:grid-cols-[60px_1fr_auto_auto] md:gap-4 md:p-3">
										<Avatar className="bg-slate-900 text-white">
											<AvatarFallback>#{item.rank}</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-sm font-medium text-slate-900">{item.college}</p>
											<p className="text-xs text-slate-600">Composite score: {item.score}</p>
										</div>
										<Badge variant="outline" className="justify-self-end border-emerald-700/30 bg-emerald-50 text-emerald-800">
											{item.trend}
										</Badge>
										<Building2 className="hidden size-4 text-slate-500 md:block" />
									</div>
									<Separator />
								</div>
							))}
						</CardContent>
					</Card>
				</section>

				<section className="animate-rise rounded-3xl border border-slate-900/10 bg-slate-900 p-6 text-white shadow-xl md:p-8" data-delay="4">
					<div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
						<div className="space-y-3">
							<h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
								Ready to put your legal skills into action?
							</h3>
							<p className="max-w-xl text-sm text-slate-300 md:text-base">
								Join competitions, unlock internships, and track your college impact on the national leaderboard.
							</p>
						</div>
						<div className="grid gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
							<label htmlFor="email" className="text-sm text-slate-200">Get launch updates</label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your college email"
								className="border-white/30 bg-white/10 text-white placeholder:text-slate-300"
							/>
							<Button className="bg-amber-400 text-slate-900 hover:bg-amber-300">Join The Platform</Button>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}

function ScaleIcon() {
	return <span className="text-lg">LO</span>
}

export default App
