import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { useAuth } from "@/lib/Context/useAPI";

const features = [
    {
        no: "01",
        title: "Thi thử trắc nghiệm",
        description: "Luyện đề nhanh với cấu trúc chuẩn, bấm giờ tự động và chấm điểm ngay.",
        href: APP_PATHS.practice,
        tag: "indigo",
    },
    {
        no: "02",
        title: "Lịch sử làm bài",
        description: "Theo dõi từng lần thi, xem lại đáp án và phân tích tiến trình ôn tập.",
        href: APP_PATHS.history,
        tag: "emerald",
    },
    {
        no: "03",
        title: "Kết quả chi tiết",
        description: "Xem điểm số, tỷ lệ đúng/sai và phân tích chi tiết sau mỗi bài thi.",
        href: APP_PATHS.results,
        tag: "amber",
    },
    {
        no: "04",
        title: "Đóng góp câu hỏi",
        description: "Gửi câu hỏi vào kho đề chung, cùng xây dựng ngân hàng đề thi.",
        href: APP_PATHS.contribute,
        tag: "rose",
    },
];

const tagColor: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-500",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-500",
};

const stats = [
    { label: "Câu hỏi", value: "1,000+" },
    { label: "Môn học", value: "20+" },
    { label: "Người dùng", value: "500+" },
    { label: "Lượt thi", value: "10,000+" },
];

export function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-white text-neutral-900">

            {/* ─── NAVBAR ─── */}
            <header className="border-b border-neutral-100">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link
                        to={APP_PATHS.home}
                        className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900"
                    >
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-indigo-600 text-[11px] font-bold text-white">
                            M
                        </span>
                        Mezon Exam
                    </Link>

                    <nav className="flex items-center gap-1">
                        {isAuthenticated ? (
                            <Button asChild size="sm" variant="accent">
                                <Link to={APP_PATHS.practice}>Vào luyện thi</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild size="sm" variant="ghost">
                                    <Link to={AUTH_PATHS.login}>Đăng nhập</Link>
                                </Button>
                                <Button asChild size="sm" variant="accent">
                                    <Link to={AUTH_PATHS.register}>Đăng ký</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* ─── HERO ─── */}
            <section className="mx-auto max-w-5xl px-6 pb-24 pt-20 sm:pt-28">
                {/* Status badge */}
                <div className="mb-8 inline-flex items-center gap-2 animate-fade-up">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-neutral-400 tracking-wide uppercase">
                        Hệ thống đang hoạt động
                    </span>
                </div>

                {/* Headline */}
                <h1 className="animate-fade-up delay-100 max-w-3xl text-5xl font-bold leading-[1.12] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
                    Luyện thi trắc nghiệm
                    <br />
                    <span className="text-indigo-600">thông minh.</span>
                </h1>

                {/* Sub */}
                <p className="animate-fade-up delay-200 mt-6 max-w-xl text-base leading-relaxed text-neutral-500">
                    Nền tảng thi thử trực tuyến dành cho sinh viên — tập trung vào
                    luyện tập, phân tích kết quả và nâng cao năng lực mỗi ngày.
                </p>

                {/* CTA */}
                <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Button asChild size="lg" variant="accent">
                                <Link to={APP_PATHS.practice}>Bắt đầu thi thử</Link>
                            </Button>
                            <Link
                                to={APP_PATHS.profile}
                                className="text-sm font-medium text-neutral-400 underline-offset-4 hover:text-neutral-700 hover:underline transition-colors"
                            >
                                Xem profile →
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button asChild size="lg" variant="accent">
                                <Link to={AUTH_PATHS.register}>Tạo tài khoản miễn phí</Link>
                            </Button>
                            <Link
                                to={AUTH_PATHS.login}
                                className="text-sm font-medium text-neutral-400 underline-offset-4 hover:text-neutral-700 hover:underline transition-colors"
                            >
                                Đã có tài khoản →
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* ─── STATS ─── */}
            <section className="border-y border-neutral-100 bg-neutral-50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid grid-cols-2 divide-x divide-y divide-neutral-100 sm:grid-cols-4 sm:divide-y-0">
                        {stats.map(stat => (
                            <div key={stat.label} className="px-8 py-8 text-center">
                                <p className="text-3xl font-bold text-neutral-900 sm:text-4xl">
                                    {stat.value}
                                </p>
                                <p className="mt-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section className="mx-auto max-w-5xl px-6 py-24">
                {/* Section label */}
                <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Tính năng
                </p>

                {/* Feature list — numbered rows */}
                <div className="divide-y divide-neutral-100">
                    {features.map((f, i) => (
                        <Link
                            key={f.no}
                            to={f.href}
                            className={`group flex items-start gap-6 py-7 transition-colors hover:bg-neutral-50 -mx-4 px-4 rounded-xl animate-fade-up delay-${(i + 1) * 100}`}
                        >
                            {/* Number */}
                            <span className="mt-0.5 shrink-0 text-xs font-medium tabular-nums text-neutral-300 w-6">
                                {f.no}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-base font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                                        {f.title}
                                    </h3>
                                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tagColor[f.tag]}`}>
                                        {f.tag === "indigo" ? "Luyện tập" : f.tag === "emerald" ? "Theo dõi" : f.tag === "amber" ? "Phân tích" : "Cộng đồng"}
                                    </span>
                                </div>
                                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 max-w-lg">
                                    {f.description}
                                </p>
                            </div>

                            {/* Arrow */}
                            <svg
                                className="mt-1 size-4 shrink-0 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── CTA STRIP ─── */}
            <section className="border-t border-neutral-100">
                <div className="mx-auto max-w-5xl px-6 py-20">
                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">
                                Sẵn sàng bắt đầu?
                            </h2>
                            <p className="mt-2 text-sm text-neutral-500 max-w-sm">
                                Miễn phí hoàn toàn. Không cần cài đặt. Bắt đầu luyện thi ngay hôm nay.
                            </p>
                        </div>
                        <div className="shrink-0">
                            {isAuthenticated ? (
                                <Button asChild size="lg" variant="accent">
                                    <Link to={APP_PATHS.practice}>Vào thi ngay</Link>
                                </Button>
                            ) : (
                                <Button asChild size="lg" variant="accent">
                                    <Link to={AUTH_PATHS.register}>Đăng ký miễn phí</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="border-t border-neutral-100">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 text-xs text-neutral-400">
                    <span className="flex items-center gap-2">
                        <span className="inline-flex size-4 items-center justify-center rounded bg-indigo-600 text-[9px] font-bold text-white">M</span>
                        © 2026 Mezon Exam
                    </span>
                    <span>Học tập rõ ràng, kết quả minh bạch.</span>
                </div>
            </footer>

        </div>
    );
}
