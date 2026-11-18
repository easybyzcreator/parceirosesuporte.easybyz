import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  CheckCircle2,
  Handshake,
  MessageCircle,
  ShieldCheck,
  Star,
} from 'lucide-react';

// === BOTÕES DE REGULAGEM DA ANIMAÇÃO NO SCROLL (Scroll-Morph Interativo) ===
const LERP_SPEED = 0.09; // Suavização estilo Apple (0.05 lento → 0.15 rápido)
const PATI_PHONE_IMAGE =
  'https://raw.githubusercontent.com/easybyzcreator/imagens/449546533bebb308f4f534d5a679e9fe23b37b19/patiebc.jpg';

type PhoneTab = 'parceiros' | 'cardapio' | 'simulador' | 'suporte';

interface HeroSectionProps {
  onExplorePartners: () => void;
  whatsappHref: string;
}

export default function HeroSection({
  onExplorePartners,
  whatsappHref,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneWrapperRef = useRef<HTMLDivElement>(null);
  const backCardLeftRef = useRef<HTMLDivElement>(null);
  const backCardRightRef = useRef<HTMLDivElement>(null);
  const floatTopRef = useRef<HTMLDivElement>(null);
  const floatMidRef = useRef<HTMLDivElement>(null);
  const floatBottomRef = useRef<HTMLDivElement>(null);
  const innerScreenRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const pointerTiltRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [activePhoneTab, setActivePhoneTab] = useState<PhoneTab>('parceiros');

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const section = sectionRef.current;
    if (!section) return;

    function updateProgressFromScroll() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;
      const scrollableDistance = Math.max(section.offsetHeight - viewportHeight * 0.55, 340);
      const scrolled = Math.max(-rect.top, 0);
      const raw = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
      targetProgressRef.current = prefersReducedMotion ? 0 : raw;
    }

    let rafId = 0;
    let running = true;

    function animate() {
      if (!running) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0004) {
        currentProgressRef.current += diff * LERP_SPEED;
      } else {
        currentProgressRef.current = target;
      }

      // Suaviza também a inclinação interativa do mouse/toque
      const pt = pointerTiltRef.current;
      pt.x += (pt.targetX - pt.x) * 0.1;
      pt.y += (pt.targetY - pt.y) * 0.1;

      const p = currentProgressRef.current;

      // 1. Movimento 3D expressivo no mockup do celular conforme o scroll + leve inclinação do cursor
      if (phoneWrapperRef.current) {
        const rotateZ = 7.5 - p * 10.5; // +7.5deg → -3deg
        const rotateY = -10 + p * 16 + pt.x * 8; // giro 3D horizontal
        const rotateX = 5 - p * 7 + pt.y * -6; // inclinação 3D vertical
        const translateY = 10 - p * 42; // deslocamento vertical perceptível
        const translateX = -8 + p * 12; // leve arco lateral
        const scale = 0.96 + p * 0.1; // 0.96 → 1.06

        phoneWrapperRef.current.style.transform = `perspective(1200px) translate3d(${translateX.toFixed(
          2
        )}px, ${translateY.toFixed(2)}px, 0) rotateZ(${rotateZ.toFixed(2)}deg) rotateY(${rotateY.toFixed(
          2
        )}deg) rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }

      // 2. Cartões decorativos atrás do celular (contra-rotação ampla e profundidade)
      if (backCardLeftRef.current) {
        const rot = -10 + p * 14; // -10deg → +4deg
        const tx = -10 - p * 18;
        const ty = p * 22;
        const sc = 0.96 + p * 0.08;
        backCardLeftRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
      }

      if (backCardRightRef.current) {
        const rot = 11 - p * 16; // +11deg → -5deg
        const tx = 10 + p * 18;
        const ty = -p * 18;
        const sc = 0.96 + p * 0.08;
        backCardRightRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
      }

      // 3. Badges flutuantes ao redor do celular com parallax acentuado
      if (floatTopRef.current) {
        const ty = -p * 44;
        const tx = p * 16;
        const rot = -4 + p * 6;
        floatTopRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      if (floatMidRef.current) {
        const ty = p * 34;
        const tx = -p * 22;
        floatMidRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0)`;
      }

      if (floatBottomRef.current) {
        const ty = -p * 52;
        const tx = p * 20;
        const rot = 2 - p * 4;
        floatBottomRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }

      // 4. Scroll profundo da tela interna do aplicativo dentro do mockup
      if (innerScreenRef.current) {
        const innerTranslate = -p * 185;
        innerScreenRef.current.style.transform = `translate3d(0, ${innerTranslate.toFixed(2)}px, 0)`;
      }

      // 5. Indicador de scroll some suavemente logo ao começar a rolar
      if (scrollHintRef.current) {
        const opacity = p < 0.08 ? 1 - p / 0.08 : 0;
        scrollHintRef.current.style.opacity = opacity.toFixed(3);
      }

      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', updateProgressFromScroll, { passive: true });
    window.addEventListener('resize', updateProgressFromScroll, { passive: true });
    updateProgressFromScroll();
    rafId = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateProgressFromScroll);
      window.removeEventListener('resize', updateProgressFromScroll);
    };
  }, []);

  const handlePhoneAreaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 a 1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 a 1
    pointerTiltRef.current.targetX = nx;
    pointerTiltRef.current.targetY = ny;
  };

  const handlePhoneAreaMouseLeave = () => {
    pointerTiltRef.current.targetX = 0;
    pointerTiltRef.current.targetY = 0;
  };

  const handlePhoneTabClick = (tab: PhoneTab) => {
    setActivePhoneTab(tab);
    if (tab === 'parceiros') {
      onExplorePartners();
    } else if (tab === 'cardapio') {
      document.getElementById('cardapio-suporte')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (tab === 'simulador') {
      document.getElementById('app-simulacao')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white border-b border-[#A38C66]/20 lg:min-h-[160vh]"
    >
      {/* Container sticky no desktop para dar a sensação tátil de scroll-morph */}
      <div className="lg:sticky lg:top-0 lg:min-h-[95vh] flex items-center overflow-hidden">
        {/* Glows sutis de fundo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#859159]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#A38C66]/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-12 sm:pb-16 lg:py-12 relative z-10">
          {/* Grid com ordem Mobile: Título -> Celular -> Subtítulo + Botões; Desktop: 2 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6 lg:gap-y-5 items-center">
            {/* 1. Tag + Título (Mobile: primeiro | Desktop: coluna esquerda topo) */}
            <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:self-end space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F6F2] border border-[#A38C66]/30 text-[#424733] text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#859159]" />
                <span>Parceiros e Suporte Easy Byz</span>
              </div>

              <h1
                className="text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#424733] tracking-tight leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                Muito além do aplicativo:{' '}
                <span className="text-[#859159]">
                  parceiros e suporte exclusivo para o seu negócio.
                </span>
              </h1>
            </div>

            {/* 2. Mockup do Celular com Movimento no Scroll (Mobile: segundo logo abaixo do título | Desktop: coluna direita inteira) */}
            <div
              onMouseMove={handlePhoneAreaMouseMove}
              onMouseLeave={handlePhoneAreaMouseLeave}
              className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-2 relative flex items-center justify-center py-4 sm:py-6"
            >
              <div className="relative w-full max-w-[320px] sm:max-w-[380px] mx-auto px-2 sm:px-0">
                {/* Camada de fundo 1 (verde oliva suave) */}
                <div
                  ref={backCardLeftRef}
                  className="absolute inset-4 -inset-x-1 sm:-inset-x-5 rounded-[38px] bg-[#859159]/25 pointer-events-none"
                  style={{
                    transform: 'rotate(-10deg)',
                    willChange: 'transform',
                  }}
                />

                {/* Camada de fundo 2 (areia EGN suave) */}
                <div
                  ref={backCardRightRef}
                  className="absolute inset-3 inset-x-0 sm:-inset-x-3 rounded-[38px] bg-[#A38C66]/25 pointer-events-none"
                  style={{
                    transform: 'rotate(11deg)',
                    willChange: 'transform',
                  }}
                />

                {/* Badge Flutuante Superior Direito (sem ícone de estrelinha) */}
                <div
                  ref={floatTopRef}
                  className="flex absolute top-0 -right-1 sm:-top-2 sm:-right-5 z-30 bg-[#424733] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 items-center text-[11px] sm:text-xs font-bold whitespace-nowrap"
                  style={{
                    transform: 'rotate(-4deg)',
                    willChange: 'transform',
                  }}
                >
                  <span>Parceiros &amp; Suporte</span>
                </div>

                {/* Card Flutuante Esquerdo */}
                <div
                  ref={floatMidRef}
                  className="flex absolute top-[52%] -left-1 sm:top-[54%] sm:-left-12 z-30 bg-white px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl border border-[#A38C66]/25 items-center gap-2 sm:gap-2.5 max-w-[165px] sm:max-w-[205px]"
                  style={{ willChange: 'transform' }}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#859159]/20 text-[#424733] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#859159]" />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-[9px] sm:text-[10px] text-[#424733]/65 font-semibold">
                      Atendimento Direto
                    </span>
                    <span className="block text-[11px] sm:text-xs font-extrabold text-[#424733]">
                      Pati • Easy Byz
                    </span>
                  </div>
                </div>

                {/* Card Flutuante Inferior Direito (sem 7+, apenas estrelas e texto) */}
                <div
                  ref={floatBottomRef}
                  className="flex absolute bottom-2 -right-1 sm:bottom-3 sm:-right-8 z-30 bg-white px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl border border-[#A38C66]/25 items-center"
                  style={{ willChange: 'transform' }}
                >
                  <div className="leading-tight space-y-0.5">
                    <div className="flex items-center gap-0.5 text-[#A38C66]">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#A38C66]" />
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#A38C66]" />
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#A38C66]" />
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#A38C66]" />
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#A38C66]" />
                    </div>
                    <span className="block text-[9.5px] sm:text-[10.5px] font-bold text-[#424733]/80 whitespace-nowrap">
                      Parceiros recomendados
                    </span>
                  </div>
                </div>

                {/* Mockup do Celular */}
                <div
                  ref={phoneWrapperRef}
                  className="relative z-20 mx-auto w-[250px] sm:w-[300px] rounded-[40px] sm:rounded-[42px] bg-[#1C1C1E] p-2.5 sm:p-3 shadow-[0_28px_65px_-15px_rgba(66,71,51,0.42)] border border-white/15"
                  style={{
                    transform: 'perspective(1200px) rotateZ(7.5deg) rotateY(-10deg) rotateX(5deg)',
                    willChange: 'transform',
                  }}
                >
                  {/* Tela do Celular */}
                  <div className="relative bg-[#FAF8F5] rounded-[32px] overflow-hidden h-[470px] sm:h-[510px] flex flex-col">
                    {/* Barra Superior + Dynamic Island */}
                    <div className="relative z-20 bg-[#FAF8F5]/95 backdrop-blur-xs px-5 pt-2.5 pb-2 flex items-center justify-between text-[10px] font-bold text-[#424733]">
                      <span>9:41</span>
                      <div className="w-20 h-4 bg-[#1C1C1E] rounded-full" />
                      <span className="text-[#859159]">5G</span>
                    </div>

                    {/* Conteúdo Interno Scrollável pelo Scroll da Página */}
                    <div className="relative flex-1 overflow-hidden px-3.5 pb-4">
                      <div
                        ref={innerScreenRef}
                        className="space-y-3"
                        style={{ willChange: 'transform' }}
                      >
                        {/* Foto da Pati em destaque dentro do celular */}
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/4.2] border border-[#A38C66]/30 shadow-xs">
                          <img
                            src={PATI_PHONE_IMAGE}
                            alt="Pati Guimarães - Easy Byz"
                            className="w-full h-full object-cover object-top"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#3c2314]/90 via-[#3c2314]/20 to-transparent" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                            <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-[#A38C66] bg-black/40 px-2 py-0.5 rounded-full mb-1">
                              Easy Byz • Suporte &amp; Parceiros
                            </span>
                            <p className="text-xs font-extrabold leading-tight">
                              Pati Guimarães
                            </p>
                          </div>
                        </div>

                        {/* Bloco de Texto Solicitado dentro do Celular */}
                        <div className="bg-gradient-to-br from-[#613C26] to-[#422717] text-white rounded-2xl p-3.5 space-y-2 shadow-sm border border-[#A38C66]/40">
                          <h3 className="text-xs sm:text-[13px] font-black leading-snug text-white">
                            Precisa de apoio para sua marmitaria crescer?
                          </h3>
                          <p className="text-[10.5px] sm:text-[11px] text-[#F0F0F0]/90 leading-relaxed">
                            Pensando e percebendo a necessidade real das nossas clientes no dia a dia, estamos sempre em busca de ajudá-las com os melhores produtos e serviços do mercado.
                          </p>
                        </div>

                        {/* Prévia dos parceiros dentro da tela conforme o scroll */}
                        <div className="bg-white rounded-2xl p-3 border border-[#A38C66]/25 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#613C26]">
                              Parceiros em Destaque
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#859159]" />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-[#424733]">
                            <div className="bg-[#FAF8F5] rounded-lg px-2 py-1.5 border border-[#A38C66]/20 truncate">
                              Além da Marca
                            </div>
                            <div className="bg-[#FAF8F5] rounded-lg px-2 py-1.5 border border-[#A38C66]/20 truncate">
                              Astrine
                            </div>
                            <div className="bg-[#FAF8F5] rounded-lg px-2 py-1.5 border border-[#A38C66]/20 truncate">
                              BiizHub
                            </div>
                            <div className="bg-[#FAF8F5] rounded-lg px-2 py-1.5 border border-[#A38C66]/20 truncate">
                              Grafike
                            </div>
                            <div className="bg-[#FAF8F5] rounded-lg px-2 py-1.5 border border-[#A38C66]/20 truncate">
                              L3 Marketing
                            </div>
                            <div className="bg-[#FAF8F5] rounded-lg px-2 py-1.5 border border-[#A38C66]/20 truncate">
                              LeOn &amp; Simpmais
                            </div>
                          </div>
                        </div>

                        {/* Card extra de suporte dentro do celular que aparece no fim do scroll */}
                        <div className="bg-[#859159]/15 rounded-2xl p-3 border border-[#859159]/35 space-y-1">
                          <span className="text-[10px] font-extrabold text-[#424733] block">
                            Suporte Easy Byz
                          </span>
                          <p className="text-[10px] text-[#424733]/80 leading-snug">
                            Cardápio pronto no app, vídeos profissionais e atendimento direto.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Barra Inferior Interativa Estilo App */}
                    <div className="relative z-20 bg-white border-t border-[#A38C66]/20 px-4 py-2 flex items-center justify-between text-[9px] font-bold text-[#424733]/70">
                      {(
                        [
                          { id: 'parceiros', label: 'Parceiros' },
                          { id: 'cardapio', label: 'Cardápio' },
                          { id: 'simulador', label: 'Simulador' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => handlePhoneTabClick(tab.id)}
                          className={`cursor-pointer transition-colors px-1.5 py-0.5 rounded-md ${
                            activePhoneTab === tab.id
                              ? 'text-[#613C26] font-extrabold bg-[#613C26]/10'
                              : 'hover:text-[#613C26]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setActivePhoneTab('suporte')}
                        className={`transition-colors px-1.5 py-0.5 rounded-md ${
                          activePhoneTab === 'suporte'
                            ? 'text-[#613C26] font-extrabold bg-[#613C26]/10'
                            : 'hover:text-[#613C26]'
                        }`}
                      >
                        Suporte
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Subtítulo + Botões + Texto de Confiança (Mobile: terceiro abaixo do celular | Desktop: coluna esquerda abaixo do título) */}
            <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:self-start space-y-5 text-center lg:text-left">
              <p className="text-sm sm:text-base md:text-lg text-[#424733]/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Tudo o que você precisa para configurar seu aplicativo, conquistar clientes e fortalecer o dia a dia da sua marmitaria.
              </p>

              {/* Dois botões de ação lado a lado */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={onExplorePartners}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#424733] hover:bg-[#613C26] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Handshake className="w-4 h-4 text-[#A38C66] shrink-0" />
                  <span>Conhecer Parceiros EasyByz</span>
                  <ArrowDown className="w-4 h-4 shrink-0" />
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#859159] hover:bg-[#613C26] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Suporte no WhatsApp</span>
                </a>
              </div>

              {/* Texto de confiança (sem bolinhas coloridas e sem "EGN") */}
              <p className="text-xs sm:text-sm text-[#424733]/75 font-medium pt-0.5">
                Empresas e suporte verificados pela <strong className="text-[#424733]">Easy Byz</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Indicador sutil de scroll (visível no desktop no início, some ao rolar) */}
        <div
          ref={scrollHintRef}
          className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1.5 pointer-events-none transition-opacity duration-300"
        >
          <span className="text-[10px] tracking-[0.18em] uppercase text-[#424733]/50 font-bold">
            Role para explorar
          </span>
          <div className="w-5 h-7 rounded-full border border-[#424733]/25 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-[#859159] animate-bounce" />
          </div>
        </div>

        {/* Degradê inferior suave para misturar com o fundo #F0F0F0 da próxima seção */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#F0F0F0] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
