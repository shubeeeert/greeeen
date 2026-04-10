import React, { useState } from 'react';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  ShieldAlert, 
  LayoutDashboard, 
  Plus, 
  LogOut, 
  Menu, 
  X,
  Camera,
  Thermometer,
  Wind,
  Pipette,
  ArrowRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Section = 'dashboard' | 'shelves' | 'water' | 'light' | 'diseases';

interface Shelf {
  id: string;
  name: string;
  tier: string;
  plants: string;
  temp: number;
  humidity: number;
  status: 'good' | 'warning' | 'danger' | 'new';
  intensity: number;
}

// --- Initial Data ---
const INITIAL_SHELVES: Shelf[] = [
  { id: 'A', name: 'Стеллаж A', tier: 'верхний ярус', plants: 'базилик, мята', temp: 23.8, humidity: 62, status: 'good', intensity: 85 },
  { id: 'B', name: 'Стеллаж B', tier: 'средний ярус', plants: 'салат, руккола', temp: 26.1, humidity: 71, status: 'warning', intensity: 72 },
  { id: 'C', name: 'Стеллаж C', tier: 'нижний ярус', plants: 'земляника', temp: 21.9, humidity: 58, status: 'danger', intensity: 90 },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shelves, setShelves] = useState<Shelf[]>(INITIAL_SHELVES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Controls
  const [waterEnabled, setWaterEnabled] = useState(true);
  const [masterLightEnabled, setMasterLightEnabled] = useState(true);
  const [uvEnabled, setUvEnabled] = useState(false);
  const [lightMode, setLightMode] = useState('growth');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'shubeeeert' && key === '12345') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Неверное имя пользователя или ключ. Попробуйте снова.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setKey('');
    setActiveSection('dashboard');
  };

  const addShelf = (newShelf: Omit<Shelf, 'id' | 'status' | 'intensity'>) => {
    const shelf: Shelf = {
      ...newShelf,
      id: Math.random().toString(36).substr(2, 9),
      status: 'new',
      intensity: 80
    };
    setShelves([...shelves, shelf]);
    setIsModalOpen(false);
    setActiveSection('shelves');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#d6d6d6] font-sans">
        {/* Left Hero */}
        <div className="relative flex-1 hidden md:flex overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/10" />
          <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-14">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-xl">
                Welcome to<br /><span className="text-[#a8d47e]">GreenEye AI</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mt-4 drop-shadow-md">Your AI gardener</p>
            </div>
            <div className="flex gap-4">
              {[Leaf, Sun, LayoutDashboard].map((Icon, i) => (
                <div key={i} className="w-16 h-16 rounded-2xl border-2 border-[#a8d47e]/80 bg-black/30 backdrop-blur-sm flex items-center justify-center text-[#a8d47e]">
                  <Icon size={32} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-[420px] lg:w-[480px] bg-[#e8e8e8] flex items-center justify-center p-6 sm:p-10">
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
            <div className="md:hidden mb-8">
               <h1 className="text-3xl font-bold text-gray-800">GreenEye AI</h1>
               <p className="text-gray-500">Your AI gardener</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Email or Nickname</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#f0f0f0] border-2 border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#7a9e3f] focus:ring-4 focus:ring-[#7a9e3f]/10 transition-all"
                placeholder="shubeeeert"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Key</label>
              <input 
                type="password" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-[#f0f0f0] border-2 border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#7a9e3f] focus:ring-4 focus:ring-[#7a9e3f]/10 transition-all"
                placeholder="•••••"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-xl text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#7a9e3f] hover:bg-[#6b8c35] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#7a9e3f]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Enter dashboard <ArrowRight size={18} />
            </button>

            <div className="text-center">
               <button type="button" className="text-sm text-gray-500 hover:text-[#7a9e3f]">Forgot Key?</button>
            </div>

            <div className="pt-4 space-y-4">
               {/* Previews */}
               <div className="bg-[#f0f0f0] p-4 rounded-2xl flex items-center justify-between border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500">
                      <Thermometer size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Temperature</p>
                      <p className="text-xs text-gray-400">Optimally 18–23°C</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[#7a9e3f]">24.6 °C</span>
               </div>

               <div className="bg-[#f0f0f0] p-4 rounded-2xl flex items-center justify-between border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500">
                      <Droplets size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Turn on water</p>
                      <p className="text-xs text-gray-400">Control supply time</p>
                    </div>
                  </div>
                  <Toggle checked={true} />
               </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2ee] flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#1e2420] text-[#8fa888] shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-2 text-[#a8d47e] mb-12">
            <Leaf className="animate-pulse" />
            <span className="text-xl font-bold tracking-tight">GreenEye AI</span>
          </div>
          
          <nav className="space-y-1">
            <NavItem active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} icon={<LayoutDashboard size={20} />} label="дашборд" />
            <NavItem active={activeSection === 'shelves'} onClick={() => setActiveSection('shelves')} icon={<Leaf size={20} />} label="полки" />
            <NavItem active={activeSection === 'water'} onClick={() => setActiveSection('water')} icon={<Droplets size={20} />} label="вода" />
            <NavItem active={activeSection === 'light'} onClick={() => setActiveSection('light')} icon={<Sun size={20} />} label="свет" />
            <NavItem active={activeSection === 'diseases'} onClick={() => setActiveSection('diseases')} icon={<ShieldAlert size={20} />} label="заболевания" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 space-y-4">
          <div className="px-4 text-xs font-medium text-[#6a8060] flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             👤 {username}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#3a4e34] hover:bg-[#4a6242] text-[#a8d47e] font-bold py-3 px-4 rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> добавить полку
          </button>
          <button 
            onClick={handleLogout}
            className="w-full border border-[#3a4e34] hover:bg-[#2c352a] text-[#8fa888] py-3 px-4 rounded-xl transition-colors flex items-center gap-2"
          >
            <LogOut size={18} /> выйти
          </button>
        </div>
      </aside>

      {/* Mobile Nav Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1e2420] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2 text-[#a8d47e]">
          <Leaf size={24} />
          <span className="text-lg font-bold">GreenEye AI</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#8fa888]">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#1e2420] pt-20 px-8 flex flex-col">
          <nav className="space-y-2 mb-8">
            <NavItem active={activeSection === 'dashboard'} onClick={() => { setActiveSection('dashboard'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={24} />} label="дашборд" />
            <NavItem active={activeSection === 'shelves'} onClick={() => { setActiveSection('shelves'); setIsSidebarOpen(false); }} icon={<Leaf size={24} />} label="полки" />
            <NavItem active={activeSection === 'water'} onClick={() => { setActiveSection('water'); setIsSidebarOpen(false); }} icon={<Droplets size={24} />} label="вода" />
            <NavItem active={activeSection === 'light'} onClick={() => { setActiveSection('light'); setIsSidebarOpen(false); }} icon={<Sun size={24} />} label="свет" />
            <NavItem active={activeSection === 'diseases'} onClick={() => { setActiveSection('diseases'); setIsSidebarOpen(false); }} icon={<ShieldAlert size={24} />} label="заболевания" />
          </nav>
          <div className="mt-auto pb-10 space-y-4">
             <button onClick={() => { setIsModalOpen(true); setIsSidebarOpen(false); }} className="w-full bg-[#3a4e34] text-[#a8d47e] font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                <Plus size={20} /> добавить полку
             </button>
             <button onClick={handleLogout} className="w-full border border-[#3a4e34] text-[#8fa888] py-4 rounded-xl flex items-center justify-center gap-2">
                <LogOut size={20} /> выйти
             </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 overflow-y-auto">
        <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto">
          {activeSection === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Main Column */}
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#2c352a] rounded-[32px] aspect-video flex flex-col items-center justify-center text-[#8fa888] relative overflow-hidden group">
                       <Camera size={48} className="mb-2 opacity-50 group-hover:scale-110 transition-transform" />
                       <span className="font-bold tracking-widest text-sm">КАМЕРА ШКАФ 1</span>
                       <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">REC</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="bg-[#dde3d8] rounded-3xl aspect-video flex items-center justify-center text-gray-400 font-medium text-sm">Превью камеры 2</div>
                       <div className="bg-[#dde3d8] rounded-3xl aspect-video flex items-center justify-center text-gray-400 font-medium text-sm">Превью камеры 3</div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                       <h3 className="text-gray-500 font-bold mb-6 text-sm uppercase tracking-wider">Общее состояние системы</h3>
                       <div className="flex gap-3 h-14">
                          <div className="flex-1 bg-[#d6edbe] text-[#4a7c20] rounded-2xl flex items-center justify-center font-bold text-sm">Хорошо</div>
                          <div className="flex-1 bg-[#ffefc0] text-[#9a7200] rounded-2xl flex items-center justify-center font-bold text-sm">Нормально</div>
                          <div className="flex-1 bg-[#ffd0cc] text-[#b03020] rounded-2xl flex items-center justify-center font-bold text-sm">Плохо</div>
                       </div>
                    </div>
                 </div>

                 {/* Side Column */}
                 <div className="space-y-6">
                    <StatCard icon={<Thermometer className="text-orange-500" />} title="Температура" value="24.6 °C" hint="оптимально: 22–26 °C" />
                    <StatCard icon={<Wind className="text-blue-400" />} title="Влажность" value="68%" hint="норма: 60–75%" />
                    <StatCard icon={<Pipette className="text-purple-500" />} title="pH почвы" value="6.2" hint="идеально: 6.0–6.8" />
                    
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                       <div className="flex items-center justify-between mb-2">
                          <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Подача воды</h3>
                          <Toggle checked={waterEnabled} onChange={() => setWaterEnabled(!waterEnabled)} />
                       </div>
                       <p className="text-2xl font-bold text-gray-800 mb-1">{waterEnabled ? 'Включён' : 'Отключён'}</p>
                       <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", waterEnabled ? "bg-green-500" : "bg-gray-300")} />
                          автоматический полив • следующий цикл: через 2 ч
                       </p>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeSection === 'shelves' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">Список полок</h2>
                <span className="bg-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-600">{shelves.length} полок</span>
              </div>
              <div className="grid gap-4">
                {shelves.map(shelf => (
                  <div key={shelf.id} className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-[#7a9e3f]/30 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-[#f0f2ee] flex items-center justify-center text-[#7a9e3f] group-hover:bg-[#7a9e3f] group-hover:text-white transition-all">
                         <Leaf size={28} />
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-800 text-lg">{shelf.name} • {shelf.tier}</h3>
                         <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400 font-medium">
                           <span className="flex items-center gap-1"><Thermometer size={14} /> {shelf.temp}°C</span>
                           <span className="flex items-center gap-1"><Droplets size={14} /> {shelf.humidity}%</span>
                           <span className="flex items-center gap-1 italic">🌿 {shelf.plants}</span>
                         </div>
                       </div>
                    </div>
                    <StatusBadge status={shelf.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'water' && (
             <div className="space-y-8 animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-gray-800">Управление поливом</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col">
                   <h3 className="text-gray-500 font-bold mb-6 text-xs uppercase tracking-wider">График полива</h3>
                   <div className="space-y-3 flex-1">
                      <ScheduleItem time="08:00" duration="15 мин" target="стеллаж A" />
                      <ScheduleItem time="14:00" duration="20 мин" target="стеллаж B" />
                      <ScheduleItem time="19:30" duration="10 мин" target="стеллаж C" />
                   </div>
                 </div>
                 
                 <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                   <h3 className="text-gray-500 font-bold mb-6 text-xs uppercase tracking-wider">Настройка по времени</h3>
                   <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-600">Время начала</label>
                        <input type="time" defaultValue="08:00" className="bg-gray-100 border-none rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-[#7a9e3f]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-600">Длительность (мин)</label>
                        <input type="number" defaultValue="15" className="w-20 bg-gray-100 border-none rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-[#7a9e3f]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-600">Повторять каждый день</label>
                        <Toggle checked={true} />
                      </div>
                      <button className="w-full bg-[#7a9e3f] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#6b8c35] transition-colors mt-2">Сохранить</button>
                   </div>
                 </div>

                 <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                   <h3 className="text-gray-500 font-bold mb-6 text-xs uppercase tracking-wider">Температура воды</h3>
                   <div className="space-y-4">
                      <div>
                        <p className="text-4xl font-bold text-[#2e6e2e]">22.5 °C</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">оптимально: 20–24 °C</p>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#7a9e3f] h-full transition-all" style={{ width: '65%' }} />
                      </div>
                      <p className="text-sm font-bold text-[#4a7c20]">Норма</p>
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                         <span className="text-sm font-medium text-gray-500">pH почвы</span>
                         <span className="text-sm font-bold text-gray-800">6.2 <span className="text-gray-300 font-normal ml-1">(6.0–6.8)</span></span>
                      </div>
                   </div>
                 </div>
               </div>
             </div>
          )}

          {activeSection === 'light' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-gray-800">Управление светом</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Main Control */}
                 <div className={cn("md:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 transition-opacity", !masterLightEnabled && "opacity-50 grayscale")}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                       <div>
                         <h3 className="text-xl font-bold text-gray-800">Главный свет</h3>
                         <p className="text-sm text-gray-400 font-medium">Управление всеми стеллажами</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <span className={cn("text-sm font-bold", masterLightEnabled ? "text-[#7a9e3f]" : "text-gray-400")}>
                           {masterLightEnabled ? 'Включён' : 'Выключен'}
                         </span>
                         <Toggle checked={masterLightEnabled} onChange={() => setMasterLightEnabled(!masterLightEnabled)} size="lg" />
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8">
                       <ModeBtn active={lightMode === 'growth'} onClick={() => setLightMode('growth')} icon="🌱" label="Рост" />
                       <ModeBtn active={lightMode === 'bloom'} onClick={() => setLightMode('bloom')} icon="🌸" label="Цветение" />
                       <ModeBtn active={lightMode === 'rest'} onClick={() => setLightMode('rest')} icon="🌙" label="Покой" />
                       <ModeBtn active={lightMode === 'custom'} onClick={() => setLightMode('custom')} icon="⚙️" label="Своё" />
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center gap-3">
                         <span className="text-sm font-bold text-gray-500">Расписание:</span>
                         <span className="text-sm font-bold text-[#7a9e3f]">06:00 – 22:00 (16 ч)</span>
                       </div>
                       <div className="relative pt-6">
                          <div className="h-2.5 bg-[#1e2420] rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-[#f0d060] to-[#f8a840]" style={{ width: '66%' }} />
                          </div>
                          <div className="absolute top-5 flex flex-col items-center" style={{ left: '66%' }}>
                             <div className="w-5 h-5 bg-white border-4 border-[#f8a840] rounded-full shadow-md" />
                             <span className="text-[10px] font-bold text-orange-500 mt-1">NOW</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 tracking-widest uppercase">
                             <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Intensity per shelf */}
                 <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-bold mb-6 text-xs uppercase tracking-wider">Интенсивность по стеллажам</h3>
                    <div className="space-y-8">
                      {shelves.map(shelf => (
                        <div key={shelf.id} className="space-y-3">
                           <div className="flex justify-between items-end">
                             <span className="text-sm font-bold text-gray-800">{shelf.name}</span>
                             <span className="text-lg font-black text-[#7a9e3f]">{shelf.intensity}%</span>
                           </div>
                           <input 
                              type="range" 
                              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#7a9e3f]" 
                              min="0" max="100" 
                              value={shelf.intensity}
                              onChange={(e) => {
                                 const val = parseInt(e.target.value);
                                 setShelves(shelves.map(s => s.id === shelf.id ? {...s, intensity: val} : s));
                              }}
                           />
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Spectrum */}
                 <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h3 className="text-gray-500 font-bold mb-6 text-xs uppercase tracking-wider">Спектр и UV</h3>
                      <div className="space-y-5">
                        <SpectrumRow label="Красный" color="bg-red-500" value={78} />
                        <SpectrumRow label="Синий" color="bg-blue-500" value={55} />
                        <SpectrumRow label="UV" color="bg-purple-500" value={30} />
                        <SpectrumRow label="Белый" color="bg-yellow-200" value={92} />
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-bold text-gray-800">UV-стерилизация</span>
                         <Toggle checked={uvEnabled} onChange={() => setUvEnabled(!uvEnabled)} />
                       </div>
                       <p className={cn("text-xs font-bold transition-colors", uvEnabled ? "text-purple-600" : "text-gray-300")}>
                         {uvEnabled ? '🟣 UV-стерилизация активна' : 'UV выключен'}
                       </p>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeSection === 'diseases' && (
             <div className="space-y-8 animate-in fade-in duration-700">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <h2 className="text-2xl font-bold text-gray-800">Диагностика заболеваний</h2>
                 <div className="flex flex-wrap gap-2">
                    <StatusBadgeSm type="success" label="1 стеллаж — норма" />
                    <StatusBadgeSm type="warning" label="1 стеллаж — внимание" />
                    <StatusBadgeSm type="danger" label="1 стеллаж — критично" />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Card Healthy */}
                  <DiseaseCard 
                    title="Стеллаж A • верхний ярус"
                    plants="базилик, мята"
                    health={92}
                    status="Здоров"
                    type="success"
                    findings={['✓ Листья без пятен', '✓ Цвет нормальный', '✓ Корни здоровые']}
                    lastScan="10 мин назад"
                  />
                  
                  {/* Card Warning */}
                  <DiseaseCard 
                    title="Стеллаж B • средний ярус"
                    plants="салат, руккола"
                    health={61}
                    status="Внимание"
                    type="warning"
                    findings={['⚠ Пожелтение краёв листьев', '⚠ Повышенная влажность (71%)', '✓ Корни без патологий']}
                    recommendation="Снизить влажность до 65%. Возможен ранний хлороз — проверьте уровень азота в растворе."
                    lastScan="8 мин назад"
                  />

                  {/* Card Critical */}
                  <DiseaseCard 
                    title="Стеллаж C • нижний ярус"
                    plants="земляника"
                    health={34}
                    status="Критично"
                    type="danger"
                    findings={['✕ Серая гниль (Botrytis cinerea)', '✕ Поражено ~40% листьев', '⚠ Температура ниже нормы (21.9°C)']}
                    recommendation="Изолируйте поражённые растения. Обработайте фунгицидом (Фундазол или Топаз). Увеличьте вентиляцию."
                    lastScan="5 мин назад"
                    hasActions
                  />
               </div>

               {/* Log */}
               <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                  <h3 className="text-gray-800 font-bold mb-6">История диагностики</h3>
                  <div className="divide-y divide-gray-50">
                    <LogEntry time="14:32" shelf="Стеллаж C" event="Обнаружена серая гниль" type="danger" />
                    <LogEntry time="13:10" shelf="Стеллаж B" event="Пожелтение листьев — предупреждение" type="warning" />
                    <LogEntry time="11:55" shelf="Стеллаж A" event="Плановое сканирование — норма" type="success" />
                    <LogEntry time="09:00" shelf="Все" event="Ежедневная проверка — всё в норме" type="success" />
                  </div>
               </div>
             </div>
          )}
        </div>
      </main>

      {/* Modal - Add Shelf */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-[#f0f2ee] flex items-center justify-center text-[#7a9e3f]"><Plus size={18} /></div>
               Добавить новую полку
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addShelf({
                name: formData.get('name') as string,
                tier: formData.get('tier') as string,
                plants: formData.get('plants') as string,
                temp: parseFloat(formData.get('temp') as string),
                humidity: parseInt(formData.get('humidity') as string),
              });
            }} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Название стеллажа</label>
                 <input name="name" required placeholder="например: Стеллаж D" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#7a9e3f] transition-all" />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ярус</label>
                 <select name="tier" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#7a9e3f] transition-all">
                    <option value="верхний ярус">Верхний</option>
                    <option value="средний ярус">Средний</option>
                    <option value="нижний ярус">Нижний</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Растения</label>
                 <input name="plants" required placeholder="например: томаты, перец" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#7a9e3f] transition-all" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Темп. (°C)</label>
                   <input name="temp" type="number" step="0.1" defaultValue="23.0" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#7a9e3f] transition-all" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Влажность (%)</label>
                   <input name="humidity" type="number" defaultValue="65" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#7a9e3f] transition-all" />
                 </div>
               </div>
               <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl transition-colors">Отмена</button>
                  <button type="submit" className="flex-1 bg-[#7a9e3f] hover:bg-[#6b8c35] text-white font-bold py-3 rounded-xl transition-colors">Добавить</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Subcomponents ---

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group",
        active 
          ? "bg-[#3a4e34] text-[#a8d87e] shadow-lg shadow-black/10" 
          : "hover:bg-[#2c352a] text-[#8fa888] hover:text-[#c5dbb8]"
      )}
    >
      <div className={cn("transition-transform group-hover:scale-110", active && "scale-110")}>{icon}</div>
      <span className="capitalize tracking-wide">{label}</span>
    </button>
  );
}

function StatCard({ icon, title, value, hint }: { icon: React.ReactNode; title: string; value: string; hint: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:border-[#7a9e3f]/20 transition-all">
       <div className="flex items-center gap-2 mb-4">
         {icon}
         <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider">{title}</h3>
       </div>
       <p className="text-3xl font-black text-gray-800 mb-1">{value}</p>
       <p className="text-xs text-gray-400 font-medium">{hint}</p>
    </div>
  );
}

function Toggle({ checked, onChange, size = 'md' }: { checked: boolean; onChange?: () => void; size?: 'md' | 'lg' }) {
  const sizes = {
    md: 'w-12 h-6.5 p-1',
    lg: 'w-14 h-8 p-1.5'
  };
  const dotSizes = {
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5'
  };
  
  return (
    <button 
      onClick={onChange}
      className={cn(
        "rounded-full transition-colors relative flex items-center",
        checked ? "bg-[#7a9e3f]" : "bg-gray-300",
        sizes[size]
      )}
    >
      <div className={cn(
        "bg-white rounded-full shadow-sm transition-transform duration-300",
        checked ? "translate-x-full" : "translate-x-0",
        dotSizes[size]
      )} />
    </button>
  );
}

function StatusBadge({ status }: { status: Shelf['status'] }) {
  const configs = {
    good: "bg-[#d6edbe] text-[#4a7c20] label-хорошо",
    warning: "bg-[#ffefc0] text-[#9a7200] label-внимание",
    danger: "bg-[#ffd0cc] text-[#b03020] label-критично",
    new: "bg-blue-100 text-blue-600 label-новый"
  };
  const labels = {
    good: 'хорошо',
    warning: 'внимание',
    danger: 'критично',
    new: 'новый'
  };
  
  return (
    <span className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest", configs[status])}>
      {labels[status]}
    </span>
  );
}

function ScheduleItem({ time, duration, target }: { time: string; duration: string; target: string }) {
  return (
    <div className="bg-[#f4f7f0] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-transparent hover:border-[#7a9e3f]/20 transition-all">
       <span className="font-black text-gray-800">{time}</span>
       <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase">
         <span className="text-[#7a9e3f]">{duration}</span>
         <span className="opacity-30">•</span>
         <span>{target}</span>
       </div>
    </div>
  );
}

function ModeBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all",
        active 
          ? "bg-[#7a9e3f] text-white shadow-lg shadow-[#7a9e3f]/20 scale-105" 
          : "bg-[#f0f2ee] text-gray-600 hover:bg-gray-200"
      )}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

function SpectrumRow({ label, color, value }: { label: string; color: string; value: number }) {
  return (
    <div className="space-y-1.5">
       <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
         <span>{label}</span>
         <span className="text-gray-800">{value}%</span>
       </div>
       <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-100">
         <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
       </div>
    </div>
  );
}

function DiseaseCard({ title, plants, health, status, type, findings, recommendation, lastScan, hasActions }: any) {
  const typeConfigs = {
    success: { badge: "bg-[#d6edbe] text-[#4a7c20]", bar: "bg-[#7fc950]", border: "border-gray-100" },
    warning: { badge: "bg-[#ffefc0] text-[#9a7200]", bar: "bg-[#f0c030]", border: "border-yellow-200" },
    danger: { badge: "bg-[#ffd0cc] text-[#b03020]", bar: "bg-[#e06040]", border: "border-red-200 bg-red-50/30" }
  };
  const config = typeConfigs[type as keyof typeof typeConfigs];

  return (
    <div className={cn("bg-white p-7 rounded-[32px] shadow-sm border flex flex-col gap-6", config.border)}>
       <div className="flex justify-between items-start gap-4">
         <div>
           <h3 className="font-bold text-gray-800 leading-tight">{title}</h3>
           <p className="text-xs text-gray-400 font-medium italic mt-0.5">🌿 {plants}</p>
         </div>
         <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", config.badge)}>
           {status}
         </span>
       </div>

       <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Здоровье растений</span>
            <span className="text-gray-800">{health}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div className={cn("h-full transition-all duration-700", config.bar)} style={{ width: `${health}%` }} />
          </div>
       </div>

       <div className="space-y-2">
         {findings.map((f: string, i: number) => (
           <p key={i} className={cn(
             "text-xs font-bold flex items-center gap-2",
             f.startsWith('✓') ? "text-[#4a7c20]" : f.startsWith('⚠') ? "text-[#9a7200]" : "text-[#b03020]"
           )}>
             {f}
           </p>
         ))}
       </div>

       {recommendation && (
         <div className={cn(
           "p-4 rounded-2xl border-l-4",
           type === 'danger' ? "bg-red-50 border-red-500" : "bg-yellow-50 border-yellow-500"
         )}>
           <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-1.5">
             {type === 'danger' ? '🚨 Срочная рекомендация AI' : '💡 Рекомендация AI'}
           </p>
           <p className="text-xs text-gray-600 font-medium leading-relaxed">{recommendation}</p>
         </div>
       )}

       {hasActions && (
         <div className="flex gap-2 pt-2 mt-auto">
            <button className="flex-1 bg-[#7a9e3f] text-white text-[11px] font-black uppercase py-3 rounded-xl hover:bg-[#6b8c35] transition-colors tracking-widest">Обработано</button>
            <button className="flex-1 bg-gray-100 text-gray-500 text-[11px] font-black uppercase py-3 rounded-xl hover:bg-gray-200 transition-colors tracking-widest">История</button>
         </div>
       )}

       <p className="text-[10px] font-bold text-gray-300 mt-auto uppercase tracking-tighter">Последнее сканирование: {lastScan}</p>
    </div>
  );
}

function StatusBadgeSm({ type, label }: { type: 'success' | 'warning' | 'danger'; label: string }) {
  const configs = {
    success: "bg-[#d6edbe] text-[#4a7c20]",
    warning: "bg-[#ffefc0] text-[#9a7200]",
    danger: "bg-[#ffd0cc] text-[#b03020]"
  };
  return (
    <span className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm", configs[type])}>
      {label}
    </span>
  );
}

function LogEntry({ time, shelf, event, type }: { time: string; shelf: string; event: string; type: 'success' | 'warning' | 'danger' }) {
  const colors = {
    success: "text-[#4a7c20]",
    warning: "text-[#9a7200]",
    danger: "text-[#b03020] font-black"
  };
  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 group">
       <span className="text-[11px] font-bold text-gray-300 w-12">{time}</span>
       <span className="text-sm font-bold text-gray-600 w-24 group-hover:text-[#7a9e3f] transition-colors">{shelf}</span>
       <span className={cn("text-sm flex-1", colors[type])}>{event}</span>
    </div>
  );
}
