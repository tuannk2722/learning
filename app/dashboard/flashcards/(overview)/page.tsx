import { Suspense } from "react";
import FlashcardFilter from "@/app/ui/flashcards/flashcards-overview/flashcard-filter";
import FlashcardHeader from "@/app/ui/flashcards/flashcards-overview/flashcard-header";
import FlashcardSetList from "@/app/ui/flashcards/flashcards-overview/flashcard-set-list";
import { Earth, Folder, FolderArchive, WholeWord, WholeWordIcon } from "lucide-react";

// ─── Data Types ──────────────────────────────────────────────────────────────

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  cards: FlashcardItem[];
  createdAt: string;
  lastStudied?: string;
  mastered: number;
  tags: string[];
  color: string;
}

// ─── Sample Data (replace with DB query later) ────────────────────────────────

export const sampleSets: FlashcardSet[] = [
  {
    id: "japanese-n5",
    title: "Tiếng Nhật N5 - Kanji cơ bản",
    description: "Bộ 25 kanji cần thiết cho kỳ thi JLPT N5",
    isPublic: true,
    cards: [
      { id: "1", front: "医者", back: "Bác sĩ", hint: "いしゃ - isha" },
      { id: "2", front: "犬", back: "Con chó", hint: "いぬ - inu" },
      { id: "3", front: "猫", back: "Con mèo", hint: "ねこ - neko" },
      { id: "4", front: "水", back: "Nước", hint: "みず - mizu" },
      { id: "5", front: "火", back: "Lửa", hint: "ひ - hi" },
      { id: "6", front: "山", back: "Núi", hint: "やま - yama" },
      { id: "7", front: "川", back: "Sông", hint: "かわ - kawa" },
      { id: "8", front: "木", back: "Cây", hint: "き - ki" },
      { id: "9", front: "花", back: "Hoa", hint: "はな - hana" },
      { id: "10", front: "空", back: "Bầu trời", hint: "そら - sora" },
      { id: "11", front: "月", back: "Mặt trăng", hint: "つき - tsuki" },
      { id: "12", front: "日", back: "Mặt trời / Ngày", hint: "ひ / にち" },
      { id: "13", front: "年", back: "Năm", hint: "とし / ねん" },
      { id: "14", front: "人", back: "Người", hint: "ひと - hito" },
      { id: "15", front: "子", back: "Đứa trẻ", hint: "こ - ko" },
      { id: "16", front: "女", back: "Phụ nữ", hint: "おんな - onna" },
      { id: "17", front: "男", back: "Đàn ông", hint: "おとこ - otoko" },
      { id: "18", front: "大", back: "To, lớn", hint: "おお - oo" },
      { id: "19", front: "小", back: "Nhỏ", hint: "ちい - chii" },
      { id: "20", front: "中", back: "Giữa, trong", hint: "なか - naka" },
      { id: "21", front: "上", back: "Trên", hint: "うえ - ue" },
      { id: "22", front: "下", back: "Dưới", hint: "した - shita" },
      { id: "23", front: "右", back: "Phải", hint: "みぎ - migi" },
      { id: "24", front: "左", back: "Trái", hint: "ひだり - hidari" },
      { id: "25", front: "本", back: "Sách / Gốc", hint: "ほん - hon" },
    ],
    createdAt: "2024-06-15",
    lastStudied: "2024-07-06",
    mastered: 14,
    tags: ["Tiếng Nhật", "JLPT", "N5"],
    color: "blue",
  },
  {
    id: "react-concepts",
    title: "React Core Concepts",
    description: "Các khái niệm nền tảng của React",
    isPublic: false,
    cards: [
      { id: "1", front: "useState", back: "Hook quản lý state trong functional component" },
      { id: "2", front: "useEffect", back: "Hook xử lý side effects" },
      { id: "3", front: "Props", back: "Dữ liệu truyền từ component cha xuống con" },
      { id: "4", front: "Virtual DOM", back: "Bản sao ảo của DOM thật, giúp React render hiệu quả hơn" },
      { id: "5", front: "JSX", back: "JavaScript XML - cú pháp mở rộng của JS để viết HTML-like" },
      { id: "6", front: "Component", back: "Khối xây dựng UI có thể tái sử dụng" },
      { id: "7", front: "useContext", back: "Hook truy cập Context không cần prop drilling" },
      { id: "8", front: "useRef", back: "Hook tạo mutable ref không gây re-render" },
      { id: "9", front: "useMemo", back: "Hook ghi nhớ kết quả tính toán tốn kém" },
      { id: "10", front: "useCallback", back: "Hook ghi nhớ hàm callback" },
      { id: "11", front: "React.memo", back: "HOC ngăn re-render khi props không đổi" },
      { id: "12", front: "Reconciliation", back: "Thuật toán diff của React để cập nhật DOM hiệu quả" },
    ],
    createdAt: "2024-05-20",
    lastStudied: "2024-07-07",
    mastered: 8,
    tags: ["React", "JavaScript", "Frontend"],
    color: "violet",
  },
  {
    id: "english-ielts",
    title: "IELTS Academic Vocabulary",
    description: "500 từ vựng học thuật quan trọng cho IELTS",
    isPublic: true,
    cards: [
      { id: "1", front: "Substantiate", back: "To provide evidence to support a claim" },
      { id: "2", front: "Corroborate", back: "To confirm or support with evidence" },
      { id: "3", front: "Elucidate", back: "To make something clear; to explain" },
      { id: "4", front: "Proliferate", back: "To increase rapidly in number; spread" },
      { id: "5", front: "Mitigate", back: "To make less severe or serious" },
      { id: "6", front: "Paradigm", back: "A typical example or model of something" },
      { id: "7", front: "Ubiquitous", back: "Present everywhere at the same time" },
      { id: "8", front: "Ambiguous", back: "Open to more than one interpretation" },
    ],
    createdAt: "2024-04-10",
    lastStudied: "2024-06-30",
    mastered: 3,
    tags: ["Tiếng Anh", "IELTS", "Từ vựng"],
    color: "emerald",
  },
  {
    id: "python-basics",
    title: "Python Fundamentals",
    description: "Từ khóa và built-in functions cơ bản trong Python",
    isPublic: false,
    cards: [
      { id: "1", front: "list comprehension", back: "[expr for item in iterable if condition]" },
      { id: "2", front: "lambda", back: "Hàm ẩn danh: lambda args: expression" },
      { id: "3", front: "decorator", back: "Hàm bọc ngoài hàm khác để thêm chức năng" },
      { id: "4", front: "generator", back: "Hàm dùng yield, trả về iterator tiết kiệm bộ nhớ" },
      { id: "5", front: "*args", back: "Tham số vị trí tùy ý, nhận tuple" },
      { id: "6", front: "**kwargs", back: "Tham số từ khóa tùy ý, nhận dict" },
    ],
    createdAt: "2024-03-05",
    lastStudied: undefined,
    mastered: 0,
    tags: ["Python", "Lập trình"],
    color: "orange",
  },
];

// ─── Backend Filter Function (replace body with DB query when ready) ──────────

async function getFilteredSets(q: string, tag: string): Promise<FlashcardSet[]> {
  // TODO: replace with: return await db.flashcardSet.findMany({ where: { ... } })
  let results = sampleSets;

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (tag && tag !== "all") {
    results = results.filter((s) => s.tags.includes(tag));
  }

  return results;
}

// ─── All available tags (replace with DB distinct query) ─────────────────────

async function getAllTags(): Promise<string[]> {
  // TODO: replace with: return await db.flashcardSet.findManyDistinct('tags')
  return Array.from(new Set(sampleSets.flatMap((s) => s.tags)));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ q?: string; tag?: string; view?: string }>;
}

export default async function FlashcardsPage({ searchParams }: PageProps) {
  const { q = "", tag = "all", view = "grid" } = await searchParams;

  const [sets, allTags] = await Promise.all([
    getFilteredSets(q, tag),
    getAllTags(),
  ]);

  const viewMode = view === "list" ? "list" : "grid";

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FlashcardHeader />

          {/* Filter Bar — client component, reads/writes URL search params */}
          <Suspense>
            <FlashcardFilter allTags={allTags} />
          </Suspense>

          <h2 className="text-xl mb-4 flex items-center gap-2 font-semibold">
            <Folder className="w-5 h-5" />
            Recent
          </h2>

          {/* Results — rendered server-side with filtered data */}
          <FlashcardSetList sets={sets} viewMode={viewMode} />

          <h2 className="text-xl mt-10 mb-4 flex items-center gap-2 font-semibold">
            <Earth className="w-5 h-5" />
            Students also studied
          </h2>
        </div>

      </div>
    </div>
  );
}
