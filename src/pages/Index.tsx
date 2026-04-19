import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

type Page = "profile" | "music" | "distribution" | "settings" | "help";

const ARTIST_IMAGE = "https://cdn.poehali.dev/projects/19d147bb-c4e6-4eb2-afb8-de91f57ffb26/files/90a9867e-752d-4283-8dc2-da9c7f91ed79.jpg";

const tracks = [
  { id: 1, title: "Неоновые огни", album: "Синтез", duration: "3:42", plays: "124K", genre: "Электро" },
  { id: 2, title: "Последний звонок", album: "Одиночество", duration: "4:15", plays: "89K", genre: "Поп" },
  { id: 3, title: "Полночный драйв", album: "Синтез", duration: "5:01", plays: "67K", genre: "Синти-поп" },
  { id: 4, title: "Городские огни", album: "Мегаполис", duration: "3:28", plays: "203K", genre: "Электро" },
  { id: 5, title: "Рассвет над морем", album: "Мегаполис", duration: "4:53", plays: "45K", genre: "Эмбиент" },
];

const albums = [
  { id: 1, title: "Синтез", year: "2024", tracks: 11, color: "from-purple-600 to-cyan-500" },
  { id: 2, title: "Мегаполис", year: "2023", tracks: 9, color: "from-pink-600 to-orange-500" },
  { id: 3, title: "Одиночество", year: "2022", tracks: 7, color: "from-blue-600 to-purple-600" },
];

const playlists = [
  { id: 1, title: "Лучшее за всё время", tracks: 23, isPublic: true },
  { id: 2, title: "Акустика", tracks: 8, isPublic: false },
  { id: 3, title: "Ремиксы", tracks: 14, isPublic: true },
];

const faqItems = [
  { q: "Как загрузить трек?", a: "Перейдите в раздел «Музыка» → «Треки» и нажмите кнопку «Загрузить трек». Поддерживаемые форматы: MP3, WAV, FLAC." },
  { q: "Какой лимит на загрузку?", a: "На базовом тарифе — до 500 MB на трек. На Pro — без ограничений." },
  { q: "Как создать альбом?", a: "В разделе «Музыка» → «Альбомы» нажмите «Новый альбом», добавьте треки и заполните метаданные." },
  { q: "Как настроить права на треки?", a: "В настройках каждого трека можно задать лицензию, запретить скачивание или ограничить регион прослушивания." },
];

// ===== UPLOAD MODAL =====
function UploadModal({ onClose }: { onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");

  const handleFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card-glass rounded-2xl neon-border p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat font-bold text-xl text-white">Загрузить трек</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <Icon name="X" size={16} className="text-white/50" />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 mb-5 ${
            dragOver
              ? "border-purple-500 bg-purple-500/10"
              : file
              ? "border-green-500/50 bg-green-500/5"
              : "border-white/15 bg-white/3 hover:border-purple-500/50 hover:bg-purple-500/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.flac,.aac,.ogg"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-green-400" />
              </div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/15 flex items-center justify-center">
                <Icon name="Upload" size={22} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Перетащите файл или нажмите для выбора</p>
                <p className="text-xs text-white/30 mt-1">MP3, WAV, FLAC, AAC · до 500 MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 block">Название трека</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all placeholder:text-white/20"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 block">Жанр</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all"
            >
              <option value="" className="bg-gray-900">Выберите жанр...</option>
              {["Электро", "Поп", "Синти-поп", "Эмбиент", "Рок", "Хип-хоп", "Джаз", "Классика"].map(g => (
                <option key={g} value={g} className="bg-gray-900">{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white/60 transition-colors">
            Отмена
          </button>
          <button
            disabled={!file || !title}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              file && title
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white btn-glow"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            Загрузить трек
          </button>
        </div>
      </div>
    </div>
  );
}

const WaveformIcon = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-end gap-0.5 h-5">
    {[3, 5, 4, 7, 3, 6, 4].map((h, i) => (
      <div
        key={i}
        style={{
          width: 2,
          height: isActive ? undefined : h * 2,
          borderRadius: 2,
          background: isActive
            ? "linear-gradient(to top, #a855f7, #00ffff)"
            : "rgba(255,255,255,0.2)",
          animation: isActive ? `wave 1.2s ease-in-out ${i * 0.1}s infinite` : undefined,
          minHeight: isActive ? 4 : undefined,
          maxHeight: isActive ? h * 2 : undefined,
        }}
      />
    ))}
  </div>
);

// ===== SUBSCRIPTION MODAL =====
function SubscribeModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<"plan" | "pay" | "done">("plan");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handlePay = () => {
    setStep("done");
    setTimeout(() => { onSuccess(); onClose(); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md card-glass rounded-2xl neon-border p-6 animate-fade-in">

        {step === "plan" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-montserrat font-bold text-xl text-white">Подписка VENOK Pro</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Icon name="X" size={16} className="text-white/50" />
              </button>
            </div>

            {/* Plan card */}
            <div className="relative rounded-2xl p-5 mb-5 overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(0,255,255,0.1))", border: "1px solid rgba(168,85,247,0.4)" }}>
              <div className="absolute top-3 right-3 text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">Популярный</div>
              <div className="flex items-end gap-2 mb-4">
                <span className="font-montserrat font-black text-4xl text-white">500 ₽</span>
                <span className="text-white/40 text-sm mb-1">/ месяц</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Выпуск музыки на 50+ площадках",
                  "Spotify, Apple Music, Яндекс, VK...",
                  "Неограниченное количество треков",
                  "Статистика и аналитика",
                  "Приоритетная поддержка",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                    <div className="w-4 h-4 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Icon name="Check" size={10} className="text-purple-300" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Free plan */}
            <div className="rounded-2xl p-4 mb-5 border border-white/8 bg-white/3">
              <p className="text-sm font-semibold text-white/50 mb-2">Бесплатный тариф</p>
              <ul className="space-y-1.5">
                {["Профиль исполнителя", "Загрузка треков в библиотеку", "❌ Дистрибуция на площадки"].map((f) => (
                  <li key={f} className="text-xs text-white/30">{f}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setStep("pay")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold btn-glow"
            >
              Оформить подписку — 500 ₽/мес
            </button>
          </>
        )}

        {step === "pay" && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep("plan")} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Icon name="ArrowLeft" size={16} className="text-white/50" />
              </button>
              <h2 className="font-montserrat font-bold text-xl text-white">Оплата</h2>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mb-5">
              <span className="text-sm text-white/60">VENOK Pro · 1 месяц</span>
              <span className="font-montserrat font-bold text-white">500 ₽</span>
            </div>

            {/* Card form */}
            <div className="space-y-4 mb-5">
              <div>
                <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 block">Номер карты</label>
                <div className="relative">
                  <input
                    value={cardNum}
                    onChange={(e) => setCardNum(formatCard(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all placeholder:text-white/20 pr-10"
                  />
                  <Icon name="CreditCard" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 block">Срок действия</label>
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="ММ/ГГ"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 block">CVV</label>
                  <input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="•••"
                    type="password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={cardNum.length < 19 || expiry.length < 5 || cvv.length < 3}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                cardNum.length >= 19 && expiry.length >= 5 && cvv.length >= 3
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white btn-glow"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              Оплатить 500 ₽
            </button>
            <p className="text-center text-xs text-white/20 mt-3">🔒 Платёж защищён SSL-шифрованием</p>
          </>
        )}

        {step === "done" && (
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-ring">
              <Icon name="CheckCircle" size={32} className="text-green-400" />
            </div>
            <h2 className="font-montserrat font-bold text-xl text-white">Подписка активирована!</h2>
            <p className="text-white/50 text-sm">Теперь тебе доступна дистрибуция на все площадки</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [activePage, setActivePage] = useState<Page>("profile");
  const [playingTrack, setPlayingTrack] = useState<number | null>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [musicTab, setMusicTab] = useState<"tracks" | "albums" | "playlists">("tracks");
  const [settingsTab, setSettingsTab] = useState<"account" | "notifications" | "privacy">("account");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "profile", label: "Профиль", icon: "User" },
    { id: "music", label: "Музыка", icon: "Music" },
    { id: "distribution", label: "Дистрибуция", icon: "Globe" },
    { id: "settings", label: "Настройки", icon: "Settings" },
    { id: "help", label: "Справка", icon: "HelpCircle" },
  ];

  return (
    <div className="min-h-screen mesh-bg bg-background flex">
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      {subscribeOpen && <SubscribeModal onClose={() => setSubscribeOpen(false)} onSuccess={() => setIsPro(true)} />}

      {/* Sidebar — только десктоп */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-border/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Icon name="Headphones" size={18} className="text-white" />
            </div>
            <span className="font-montserrat font-extrabold text-xl tracking-wider gradient-text">VENOK</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activePage === item.id ? "active text-white" : "text-white/50 hover:text-white"
              }`}
            >
              <Icon name={item.icon} size={18} className={activePage === item.id ? "text-purple-400" : ""} />
              {item.label}
              {item.id === "music" && (
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">27</span>
              )}
            </button>
          ))}
        </nav>

        {/* Pro badge / upgrade */}
        <div className="px-4 pb-3">
          {isPro ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Icon name="Sparkles" size={14} className="text-purple-400" />
              <span className="text-xs font-semibold text-purple-300">Pro активен</span>
            </div>
          ) : (
            <button
              onClick={() => setSubscribeOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-all group"
            >
              <Icon name="Zap" size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">Получить Pro — 500 ₽/мес</span>
            </button>
          )}
        </div>

        {/* Mini Player */}
        <div className="p-4 border-t border-border/50">
          <div className="card-glass rounded-xl p-3 neon-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <Icon name="Music" size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Неоновые огни</p>
                <p className="text-xs text-white/40 truncate">Синтез · 2024</p>
              </div>
              <button className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center animate-pulse-ring">
                <Icon name="Pause" size={12} className="text-white" />
              </button>
            </div>
            <div className="mt-2.5 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-2/5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">

        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 border-b border-border/50 backdrop-blur-xl bg-background/60">
          {/* Мобильный логотип */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <Icon name="Headphones" size={14} className="text-white" />
            </div>
            <span className="font-montserrat font-extrabold text-base tracking-wider gradient-text">VENOK</span>
          </div>
          <h1 className="hidden md:block font-montserrat font-bold text-xl text-white">
            {activePage === "profile" && "Профиль исполнителя"}
            {activePage === "music" && "Управление музыкой"}
            {activePage === "distribution" && "Дистрибуция"}
            {activePage === "settings" && "Настройки аккаунта"}
            {activePage === "help" && "Справка и поддержка"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Icon name="Bell" size={16} className="text-white/60" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500/50">
              <img src={ARTIST_IMAGE} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">

          {/* ===== PROFILE ===== */}
          {activePage === "profile" && (
            <div className="space-y-6 animate-fade-in">

              {/* Hero Banner */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900" />
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/20 via-transparent to-cyan-400/20" />
                {/* Десктоп */}
                <div className="hidden md:flex absolute inset-0 items-end p-8">
                  <div className="flex items-end gap-6">
                    <div className="relative">
                      <img src={ARTIST_IMAGE} alt="Artist" className="w-28 h-28 rounded-2xl object-cover border-4 border-white/10 shadow-2xl shadow-purple-500/30" />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-400 border-2 border-background flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-900" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-montserrat font-bold text-3xl text-white">NOVA</h2>
                        {isPro && <span className="text-xs bg-purple-500/30 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Icon name="Sparkles" size={10} />Pro</span>}
                      </div>
                      <p className="text-white/60 text-sm">Электронная музыка · Москва</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-white/40 flex items-center gap-1"><Icon name="Music" size={12} />27 треков</span>
                        <span className="text-xs text-white/40 flex items-center gap-1"><Icon name="Users" size={12} />14.2K подписчиков</span>
                        <span className="text-xs text-white/40 flex items-center gap-1"><Icon name="Play" size={12} />531K прослушиваний</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-sm text-white font-medium backdrop-blur-sm border border-white/10">Редактировать</button>
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold btn-glow">Поделиться</button>
                  </div>
                </div>
                {/* Мобильный */}
                <div className="md:hidden flex flex-col items-center p-6 pt-8 pb-6 gap-3">
                  <div className="relative">
                    <img src={ARTIST_IMAGE} alt="Artist" className="w-24 h-24 rounded-2xl object-cover border-4 border-white/10 shadow-2xl shadow-purple-500/30" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-background" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h2 className="font-montserrat font-bold text-2xl text-white">NOVA</h2>
                      {isPro && <span className="text-xs bg-purple-500/30 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">Pro</span>}
                    </div>
                    <p className="text-white/60 text-sm">Электронная музыка · Москва</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button className="flex-1 py-2 rounded-xl bg-white/10 text-sm text-white font-medium border border-white/10">Редактировать</button>
                    <button className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold">Поделиться</button>
                  </div>
                </div>
                <div className="hidden md:block h-56" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: "Прослушивания", value: "531K", change: "+12%", icon: "Headphones" },
                  { label: "Подписчики", value: "14.2K", change: "+8%", icon: "Users" },
                  { label: "Плейлисты", value: "2.1K", change: "+24%", icon: "ListMusic" },
                  { label: "Доход", value: "₽38K", change: "+5%", icon: "TrendingUp" },
                ].map((stat, i) => (
                  <div key={i} className="stat-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Icon name={stat.icon} size={20} className="text-purple-400" />
                      <span className="text-xs text-green-400 font-semibold">{stat.change}</span>
                    </div>
                    <p className="font-montserrat font-bold text-2xl text-white">{stat.value}</p>
                    <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Bio + Top tracks */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
                <div className="md:col-span-2 card-glass rounded-2xl p-5 md:p-6 neon-border">
                  <h3 className="font-montserrat font-bold text-xs text-white/40 uppercase tracking-widest mb-4">О себе</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    Электронный музыкант из Москвы. Создаю синти-поп и электронную музыку с 2018 года. Вдохновляюсь городской эстетикой и ночной жизнью.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Синти-поп", "Электро", "Эмбиент", "Дрим-поп"].map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                      <Icon name="Instagram" size={14} className="text-purple-400" />
                      @nova_music
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                      <Icon name="Globe" size={14} className="text-purple-400" />
                      nova-music.ru
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 card-glass rounded-2xl p-5 md:p-6 neon-border">
                  <h3 className="font-montserrat font-bold text-xs text-white/40 uppercase tracking-widest mb-4">Топ треков</h3>
                  <div className="space-y-1">
                    {tracks.slice(0, 4).map((track, i) => (
                      <div
                        key={track.id}
                        onClick={() => setPlayingTrack(playingTrack === track.id ? null : track.id)}
                        className="track-row flex items-center gap-4 p-3 rounded-xl cursor-pointer"
                      >
                        <span className="text-white/20 text-sm w-4 font-montserrat font-bold">{i + 1}</span>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/80 to-cyan-500/80 flex items-center justify-center flex-shrink-0">
                          {playingTrack === track.id
                            ? <WaveformIcon isActive />
                            : <Icon name="Play" size={14} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${playingTrack === track.id ? "gradient-text" : "text-white"}`}>{track.title}</p>
                          <p className="text-xs text-white/30 truncate">{track.album}</p>
                        </div>
                        <span className="text-xs text-white/30">{track.plays}</span>
                        <span className="text-xs text-white/20">{track.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== MUSIC ===== */}
          {activePage === "music" && (
            <div className="space-y-6 animate-fade-in">

              {/* Upload CTA */}
              <div className="relative rounded-2xl overflow-hidden p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,255,255,0.1))", border: "1px solid rgba(168,85,247,0.3)" }}>
                <div>
                  <h2 className="font-montserrat font-bold text-xl md:text-2xl text-white mb-1">Загрузить новый трек</h2>
                  <p className="text-white/50 text-sm">MP3, WAV, FLAC · до 500 MB</p>
                </div>
                <button
                  onClick={() => setUploadOpen(true)}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold btn-glow flex items-center justify-center gap-2"
                >
                  <Icon name="Upload" size={18} />
                  Загрузить
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
                {(["tracks", "albums", "playlists"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMusicTab(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      musicTab === tab
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {tab === "tracks" ? "Треки" : tab === "albums" ? "Альбомы" : "Плейлисты"}
                  </button>
                ))}
              </div>

              {/* Tracks */}
              {musicTab === "tracks" && (
                <div className="card-glass rounded-2xl overflow-hidden neon-border">
                  {/* Десктоп заголовок */}
                  <div className="hidden md:grid grid-cols-[2rem_1fr_1fr_6rem_5rem_3rem] gap-4 px-6 py-3 text-xs font-semibold text-white/20 uppercase tracking-widest border-b border-white/5">
                    <span>#</span><span>Название</span><span>Альбом</span><span>Жанр</span><span>Прослушиваний</span><span>Длина</span>
                  </div>
                  {tracks.map((track, i) => (
                    <div
                      key={track.id}
                      onClick={() => setPlayingTrack(playingTrack === track.id ? null : track.id)}
                      className="track-row border-b border-white/3 last:border-0 cursor-pointer"
                    >
                      {/* Десктоп строка */}
                      <div className="hidden md:grid grid-cols-[2rem_1fr_1fr_6rem_5rem_3rem] gap-4 px-6 py-4 items-center">
                        <span className="text-white/20 text-sm font-montserrat">{i + 1}</span>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                            {playingTrack === track.id ? <WaveformIcon isActive /> : <Icon name="Music2" size={14} className="text-white" />}
                          </div>
                          <span className={`text-sm font-medium truncate ${playingTrack === track.id ? "gradient-text" : "text-white"}`}>{track.title}</span>
                        </div>
                        <span className="text-sm text-white/40 truncate">{track.album}</span>
                        <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full w-fit">{track.genre}</span>
                        <span className="text-sm text-white/40">{track.plays}</span>
                        <span className="text-sm text-white/30">{track.duration}</span>
                      </div>
                      {/* Мобильная строка */}
                      <div className="md:hidden flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          {playingTrack === track.id ? <WaveformIcon isActive /> : <Icon name="Music2" size={14} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${playingTrack === track.id ? "gradient-text" : "text-white"}`}>{track.title}</p>
                          <p className="text-xs text-white/30">{track.album} · {track.duration}</p>
                        </div>
                        <span className="text-xs text-white/30">{track.plays}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Albums */}
              {musicTab === "albums" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {albums.map((album) => (
                    <div key={album.id} className="card-glass rounded-2xl overflow-hidden neon-border hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                      <div className={`h-40 bg-gradient-to-br ${album.color} flex items-center justify-center relative`}>
                        <Icon name="Disc" size={48} className="text-white/40 group-hover:text-white/60 transition-colors" />
                        <button className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                          <Icon name="Play" size={16} className="text-white" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-montserrat font-bold text-white">{album.title}</h3>
                        <p className="text-sm text-white/40 mt-0.5">{album.year} · {album.tracks} треков</p>
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60 transition-colors">Редактировать</button>
                          <button className="px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-xs text-purple-300 transition-colors">
                            <Icon name="Share2" size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="card-glass rounded-2xl border-dashed border-2 border-white/10 hover:border-purple-500/40 flex flex-col items-center justify-center gap-3 min-h-[220px] transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-purple-500/15 flex items-center justify-center transition-colors">
                      <Icon name="Plus" size={22} className="text-white/30 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors">Новый альбом</span>
                  </button>
                </div>
              )}

              {/* Playlists */}
              {musicTab === "playlists" && (
                <div className="space-y-3">
                  {playlists.map((pl) => (
                    <div key={pl.id} className="card-glass rounded-2xl p-5 neon-border flex items-center gap-4 hover:border-purple-500/40 transition-all duration-200 cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Icon name="ListMusic" size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{pl.title}</h3>
                        <p className="text-sm text-white/40">{pl.tracks} треков</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${pl.isPublic ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/30"}`}>
                        {pl.isPublic ? "Публичный" : "Приватный"}
                      </span>
                      <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Icon name="MoreHorizontal" size={16} className="text-white/40" />
                      </button>
                    </div>
                  ))}
                  <button className="card-glass rounded-2xl p-5 border-dashed border-2 border-white/10 hover:border-purple-500/40 flex items-center gap-4 w-full transition-all duration-200 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-purple-500/10 flex items-center justify-center">
                      <Icon name="Plus" size={20} className="text-white/30 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Создать плейлист</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===== DISTRIBUTION ===== */}
          {activePage === "distribution" && (
            <div className="space-y-6 animate-fade-in relative">

              {/* Hero */}
              <div className="relative rounded-2xl overflow-hidden p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                style={{ background: "linear-gradient(135deg, rgba(247,37,133,0.2), rgba(255,107,53,0.15), rgba(168,85,247,0.1))", border: "1px solid rgba(247,37,133,0.3)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-pink-400 bg-pink-500/15 border border-pink-500/30 px-2.5 py-1 rounded-full">Агрегатор</span>
                  </div>
                  <h2 className="font-montserrat font-bold text-xl md:text-2xl text-white mb-1">Отправь музыку на все площадки</h2>
                  <p className="text-white/50 text-sm max-w-md">Твои треки появятся в Spotify, Яндекс Музыке, Apple Music и ещё 50+ сервисах через партнёрский агрегатор DistroKid</p>
                </div>
                <a
                  href="https://distrokid.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 flex-shrink-0 transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #f72585, #ff6b35)" }}
                >
                  <Icon name="Send" size={18} />
                  Подключить дистрибуцию
                </a>
              </div>

              {/* Platforms grid */}
              <div>
                <h3 className="font-montserrat font-bold text-white mb-4">Поддерживаемые площадки</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: "Spotify", icon: "🎵", status: "active", color: "from-green-600/20 to-green-600/5", border: "border-green-500/20", badge: "Активно", badgeColor: "text-green-400 bg-green-500/15" },
                    { name: "Яндекс Музыка", icon: "🎶", status: "active", color: "from-yellow-600/20 to-yellow-600/5", border: "border-yellow-500/20", badge: "Активно", badgeColor: "text-yellow-400 bg-yellow-500/15" },
                    { name: "Apple Music", icon: "🍎", status: "active", color: "from-pink-600/20 to-pink-600/5", border: "border-pink-500/20", badge: "Активно", badgeColor: "text-pink-400 bg-pink-500/15" },
                    { name: "VK Музыка", icon: "💙", status: "pending", color: "from-blue-600/20 to-blue-600/5", border: "border-blue-500/20", badge: "Ожидание", badgeColor: "text-blue-300 bg-blue-500/15" },
                    { name: "YouTube Music", icon: "▶️", status: "active", color: "from-red-600/20 to-red-600/5", border: "border-red-500/20", badge: "Активно", badgeColor: "text-red-400 bg-red-500/15" },
                    { name: "TikTok", icon: "🎤", status: "pending", color: "from-purple-600/20 to-purple-600/5", border: "border-purple-500/20", badge: "Ожидание", badgeColor: "text-purple-300 bg-purple-500/15" },
                    { name: "Deezer", icon: "🎧", status: "inactive", color: "from-orange-600/20 to-orange-600/5", border: "border-orange-500/15", badge: "Подключить", badgeColor: "text-orange-400 bg-orange-500/10" },
                    { name: "SoundCloud", icon: "☁️", status: "inactive", color: "from-orange-500/15 to-orange-500/5", border: "border-orange-400/15", badge: "Подключить", badgeColor: "text-orange-300 bg-orange-500/10" },
                    { name: "Amazon Music", icon: "📦", status: "inactive", color: "from-cyan-600/20 to-cyan-600/5", border: "border-cyan-500/15", badge: "Подключить", badgeColor: "text-cyan-400 bg-cyan-500/10" },
                    { name: "Tidal", icon: "🌊", status: "inactive", color: "from-indigo-600/20 to-indigo-600/5", border: "border-indigo-500/15", badge: "Подключить", badgeColor: "text-indigo-300 bg-indigo-500/10" },
                    { name: "Boom", icon: "💥", status: "inactive", color: "from-purple-600/15 to-pink-600/5", border: "border-purple-500/15", badge: "Подключить", badgeColor: "text-purple-300 bg-purple-500/10" },
                    { name: "+50 других", icon: "✨", status: "inactive", color: "from-white/5 to-transparent", border: "border-white/10", badge: "В агрегаторе", badgeColor: "text-white/40 bg-white/5" },
                  ].map((p) => (
                    <div key={p.name} className={`card-glass rounded-2xl p-4 bg-gradient-to-br ${p.color} border ${p.border} flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200`}>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{p.icon}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.badgeColor}`}>{p.badge}</span>
                      </div>
                      <p className="font-montserrat font-semibold text-sm text-white">{p.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracks distribution status */}
              <div>
                <h3 className="font-montserrat font-bold text-white mb-4">Статус треков</h3>
                <div className="card-glass rounded-2xl overflow-hidden neon-border">
                  <div className="grid grid-cols-[1fr_5rem_8rem_6rem] gap-4 px-6 py-3 text-xs font-semibold text-white/20 uppercase tracking-widest border-b border-white/5">
                    <span>Трек</span><span>Площадки</span><span>Статус</span><span>Действие</span>
                  </div>
                  {tracks.map((track) => {
                    const statuses = [
                      { label: "Активен", color: "text-green-400 bg-green-500/15" },
                      { label: "На модерации", color: "text-yellow-400 bg-yellow-500/15" },
                      { label: "Не опубликован", color: "text-white/30 bg-white/5" },
                    ];
                    const s = statuses[track.id % 3];
                    return (
                      <div key={track.id} className="track-row grid grid-cols-[1fr_5rem_8rem_6rem] gap-4 px-6 py-4 items-center border-b border-white/3 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <Icon name="Music2" size={14} className="text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{track.title}</p>
                            <p className="text-xs text-white/30">{track.album}</p>
                          </div>
                        </div>
                        <span className="text-sm text-white/50">{track.id % 3 === 2 ? "—" : "7 из 12"}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${s.color}`}>{s.label}</span>
                        <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                          {track.id % 3 === 2 ? "Опубликовать" : "Подробнее"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Banner */}
              <div className="card-glass rounded-2xl p-6 text-center neon-border">
                <p className="text-white/50 text-sm mb-1">Нет аккаунта у агрегатора?</p>
                <p className="font-montserrat font-bold text-white text-lg mb-4">Зарегистрируйся в DistroKid и получи скидку 7%</p>
                <a
                  href="https://distrokid.com/vip/seven/venok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Icon name="ExternalLink" size={16} />
                  Перейти на DistroKid
                </a>
              </div>

              {/* PAYWALL — накрывает весь раздел если нет Pro */}
              {!isPro && (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center z-10"
                  style={{ backdropFilter: "blur(12px)", background: "rgba(10,8,20,0.75)" }}>
                  <div className="text-center px-6 max-w-sm animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/40">
                      <Icon name="Lock" size={28} className="text-white" />
                    </div>
                    <h3 className="font-montserrat font-bold text-2xl text-white mb-2">Только для Pro</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6">
                      Выпускай музыку на Spotify, Яндекс Музыке, Apple Music и 50+ площадках. Подписка даёт полный доступ к дистрибуции.
                    </p>
                    <div className="flex items-end justify-center gap-1 mb-5">
                      <span className="font-montserrat font-black text-4xl gradient-text">500 ₽</span>
                      <span className="text-white/40 text-sm mb-1">/ месяц</span>
                    </div>
                    <button
                      onClick={() => setSubscribeOpen(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold btn-glow text-sm"
                    >
                      Подключить Pro
                    </button>
                    <p className="text-xs text-white/20 mt-3">Отмена в любое время</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== SETTINGS ===== */}
          {activePage === "settings" && (
            <div className="space-y-6 animate-fade-in max-w-2xl">

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
                {(["account", "notifications", "privacy"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSettingsTab(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      settingsTab === tab
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {tab === "account" ? "Аккаунт" : tab === "notifications" ? "Уведомления" : "Приватность"}
                  </button>
                ))}
              </div>

              {settingsTab === "account" && (
                <div className="space-y-4">
                  <div className="card-glass rounded-2xl p-6 neon-border space-y-5">
                    <h3 className="font-montserrat font-bold text-white">Личные данные</h3>
                    {[
                      { label: "Имя артиста", value: "NOVA", type: "text" },
                      { label: "Email", value: "nova@mail.ru", type: "email" },
                      { label: "Город", value: "Москва", type: "text" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 block">{field.label}</label>
                        <input
                          type={field.type}
                          defaultValue={field.value}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all"
                        />
                      </div>
                    ))}
                    <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold btn-glow">
                      Сохранить изменения
                    </button>
                  </div>

                  <div className="card-glass rounded-2xl p-6 neon-border space-y-4">
                    <h3 className="font-montserrat font-bold text-white">Биография</h3>
                    <textarea
                      defaultValue="Электронный музыкант из Москвы. Создаю синти-поп и электронную музыку с 2018 года."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all resize-none"
                    />
                    <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold btn-glow">
                      Сохранить
                    </button>
                  </div>

                  {/* Подписка */}
                  <div className={`card-glass rounded-2xl p-6 ${isPro ? "border border-purple-500/30 bg-purple-500/5" : "neon-border"}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-montserrat font-bold text-white">Подписка</h3>
                        <p className="text-xs text-white/40 mt-0.5">{isPro ? "Pro — активна" : "Бесплатный тариф"}</p>
                      </div>
                      {isPro
                        ? <span className="flex items-center gap-1 text-xs font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full"><Icon name="Sparkles" size={12} />Pro</span>
                        : <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">Free</span>
                      }
                    </div>
                    {isPro ? (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50">Следующее списание</span>
                          <span className="text-white">19 мая 2026</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50">Сумма</span>
                          <span className="text-white">500 ₽/мес</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-white/40 mb-4">Подключи Pro чтобы выпускать музыку на 50+ площадках</p>
                    )}
                    {!isPro && (
                      <button
                        onClick={() => setSubscribeOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold btn-glow"
                      >
                        Подключить Pro — 500 ₽/мес
                      </button>
                    )}
                    {isPro && (
                      <button className="text-xs text-white/30 hover:text-white/50 transition-colors">
                        Отменить подписку
                      </button>
                    )}
                  </div>

                  <div className="card-glass rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
                    <h3 className="font-montserrat font-bold text-red-400 mb-2">Опасная зона</h3>
                    <p className="text-sm text-white/40 mb-4">Удаление аккаунта необратимо. Все треки, альбомы и данные будут удалены.</p>
                    <button className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                      Удалить аккаунт
                    </button>
                  </div>
                </div>
              )}

              {settingsTab === "notifications" && (
                <div className="card-glass rounded-2xl p-6 neon-border space-y-5">
                  <h3 className="font-montserrat font-bold text-white">Уведомления</h3>
                  {[
                    { label: "Новые подписчики", desc: "Когда кто-то подписывается на вас", on: true },
                    { label: "Комментарии", desc: "К вашим трекам и альбомам", on: true },
                    { label: "Прослушивания", desc: "Еженедельная сводка статистики", on: false },
                    { label: "Новости платформы", desc: "Обновления и новые функции VENOK", on: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-white/30">{item.desc}</p>
                      </div>
                      <div className={`w-11 h-6 rounded-full relative flex-shrink-0 cursor-pointer ${item.on ? "bg-purple-500" : "bg-white/10"}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${item.on ? "right-0.5" : "left-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {settingsTab === "privacy" && (
                <div className="card-glass rounded-2xl p-6 neon-border space-y-5">
                  <h3 className="font-montserrat font-bold text-white">Приватность</h3>
                  {[
                    { label: "Публичный профиль", desc: "Ваш профиль виден всем пользователям", on: true },
                    { label: "Показывать статистику", desc: "Прослушивания видны другим", on: true },
                    { label: "Разрешить скачивание", desc: "Треки можно скачивать бесплатно", on: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-white/30">{item.desc}</p>
                      </div>
                      <div className={`w-11 h-6 rounded-full relative flex-shrink-0 cursor-pointer ${item.on ? "bg-purple-500" : "bg-white/10"}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${item.on ? "right-0.5" : "left-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== HELP ===== */}
          {activePage === "help" && (
            <div className="space-y-6 animate-fade-in max-w-2xl">

              {/* Search */}
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  placeholder="Поиск по справке..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-all placeholder:text-white/20"
                />
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "BookOpen", label: "Документация", color: "from-purple-600/20 to-purple-600/5" },
                  { icon: "MessageCircle", label: "Чат поддержки", color: "from-cyan-600/20 to-cyan-600/5" },
                  { icon: "Video", label: "Видеоуроки", color: "from-pink-600/20 to-pink-600/5" },
                ].map((item) => (
                  <button key={item.label} className={`card-glass rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.03] transition-transform duration-200 bg-gradient-to-br ${item.color} border border-white/8`}>
                    <Icon name={item.icon} size={24} className="text-white/70" />
                    <span className="text-sm font-medium text-white/70">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* FAQ */}
              <div className="card-glass rounded-2xl overflow-hidden neon-border">
                <div className="px-6 py-4 border-b border-white/5">
                  <h3 className="font-montserrat font-bold text-white">Частые вопросы</h3>
                </div>
                {faqItems.map((item, i) => (
                  <div key={i} className="border-b border-white/5 last:border-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-white">{item.q}</span>
                      <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-white/30 flex-shrink-0" />
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-4 animate-fade-in">
                        <p className="text-sm text-white/50 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="card-glass rounded-2xl p-6 neon-border-cyan text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/15 flex items-center justify-center mx-auto mb-3">
                  <Icon name="Headphones" size={22} className="text-cyan-400" />
                </div>
                <h3 className="font-montserrat font-bold text-white mb-1">Нужна помощь?</h3>
                <p className="text-sm text-white/40 mb-4">Наша команда на связи 24/7</p>
                <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  Написать в поддержку
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Нижний таббар — только мобильные */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-border/50 backdrop-blur-xl bg-background/90">
        <div className="flex items-stretch">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200 ${
                activePage === item.id ? "text-purple-400" : "text-white/30"
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {activePage === item.id && (
                <div className="absolute bottom-0 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}