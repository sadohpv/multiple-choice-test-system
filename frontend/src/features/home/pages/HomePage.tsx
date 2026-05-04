import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { APP_PATHS } from "@/constants/path";

const features = [
  {
    title: "Thi thử",
    description: "Vào bài luyện tập nhanh với cấu trúc rõ ràng.",
    href: APP_PATHS.practice,
    accent: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  {
    title: "Xem lịch sử",
    description: "Theo dõi các lần làm bài và tiến độ ôn tập.",
    href: APP_PATHS.history,
    accent: "border-sky-200 bg-sky-50 text-sky-900",
  },
  {
    title: "Kết quả",
    description: "Xem điểm số và trạng thái sau mỗi lượt thi.",
    href: APP_PATHS.results,
    accent: "border-amber-200 bg-amber-50 text-amber-900",
  },
  {
    title: "Đóng góp câu hỏi",
    description: "Chuẩn bị luồng gửi câu hỏi cho kho đề chung.",
    href: APP_PATHS.contribute,
    accent: "border-rose-200 bg-rose-50 text-rose-900",
  },
];

export function HomePage() {
  return (
    <main>
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
                Hệ thống thi trắc nghiệm
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Không gian luyện thi gọn, dễ dùng, tập trung vào làm bài, xem
                tiến độ và quản lý tài khoản user.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={APP_PATHS.practice}>Bắt đầu thi thử</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={APP_PATHS.profile}>Xem profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link
                key={feature.title}
                className={`rounded-lg border p-5 transition-transform hover:-translate-y-0.5 ${feature.accent}`}
                to={feature.href}
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 opacity-80">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
