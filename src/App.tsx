/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Play,
  Smartphone,
  Sparkles,
  Tv,
  Video,
  X,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PartnersPage } from './components/PartnersPage';
import HeroSection from './components/HeroSection';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EASYBYZ_WHATSAPP = '18038889018';
const DEFAULT_SUPPORT_MSG =
  'Olá Pati, sou aluna da EGN e estou com uma dúvida sobre os parceiros ou suporte da Easy Byz. Você pode me ajudar?';

interface InspirationVideo {
  id: string;
  shortcode: string;
  label: string;
  brand: string;
  highlight?: string;
  url: string;
}

const INSPIRATION_VIDEOS: InspirationVideo[] = [
  {
    id: 'video-1',
    shortcode: 'Dfw-VKiPHLV',
    label: 'Vídeo 1',
    brand: 'Grão & Sabor',
    highlight: 'Vídeo feito pela profissional que recomendamos aqui',
    url: 'https://www.instagram.com/p/Dfw-VKiPHLV/',
  },
  {
    id: 'video-2',
    shortcode: 'DeuM6zVg88m',
    label: 'Vídeo 2',
    brand: 'Lu das Marmitas',
    url: 'https://www.instagram.com/p/DeuM6zVg88m/',
  },
  {
    id: 'video-3',
    shortcode: 'De9vt3EJMOL',
    label: 'Vídeo 3',
    brand: 'Donari Marmitaria',
    url: 'https://www.instagram.com/p/De9vt3EJMOL/',
  },
  {
    id: 'video-4',
    shortcode: 'Defbj39vcrt',
    label: 'Vídeo 4',
    brand: 'Aroma & Sabores',
    url: 'https://www.instagram.com/p/Defbj39vcrt/',
  },
  {
    id: 'video-5',
    shortcode: 'DeNEuCWIn4w',
    label: 'Vídeo 5',
    brand: 'Cozinha de Mãe',
    url: 'https://www.instagram.com/p/DeNEuCWIn4w/',
  },
];

const FOOTER_LOGO_URL =
  'https://raw.githubusercontent.com/easybyzcreator/imagens/8afcc7b58eca4ce99fe97d845b2baf50507ee6bc/logo%20easy%20byz%20-%20fundo%20transparente.png';

const TintedFooterLogo: React.FC = () => {
  const [tintedSrc, setTintedSrc] = useState<string>(FOOTER_LOGO_URL);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        // Recolore os pixels visíveis para #F0F0F0 (mesma cor de "EGN - Escola de Gastronomia e Negócios")
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            data[i] = 240;
            data[i + 1] = 240;
            data[i + 2] = 240;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const outUrl = canvas.toDataURL('image/png');
        if (!cancelled) {
          setTintedSrc(outUrl);
        }
      } catch {
        // Fallback para imagem original se houver restrição
      }
    };

    img.src = FOOTER_LOGO_URL;
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <img
      src={tintedSrc}
      alt="EASY BYZ"
      className="h-[84px] sm:h-28 w-auto object-contain mx-auto"
      referrerPolicy="no-referrer"
    />
  );
};

export default function App() {
  const [selectedInspirationVideo, setSelectedInspirationVideo] =
    useState<InspirationVideo | null>(null);

  useEffect(() => {
    if (!selectedInspirationVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedInspirationVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInspirationVideo]);

  const scrollToPartners = () => {
    const el = document.getElementById('parceiros-catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F0F0F0] font-sans text-[#424733] selection:bg-[#859159] selection:text-white antialiased">
      {/* Faixa superior mantida sem textos */}
      <div className="h-8 sm:h-9 bg-[#424733] border-b border-[#613C26]" />

      {/* Header Hero com Mockup do Celular e Movimento no Scroll */}
      <HeroSection
        onExplorePartners={scrollToPartners}
        whatsappHref={`https://wa.me/${EASYBYZ_WHATSAPP}?text=${encodeURIComponent(DEFAULT_SUPPORT_MSG)}`}
      />

      {/* Conteúdo Principal */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-14 sm:pb-20">
        {/* Bloco Explicativo logo abaixo do Header (Imagem 12) */}
        <section className="mb-5 sm:mb-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-[#A38C66]/35 shadow-xs space-y-4 sm:space-y-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#424733] leading-snug">
              Por que criamos esta página para você?
            </h2>

            <div className="space-y-5 sm:space-y-6 text-xs sm:text-sm md:text-base text-[#424733]/85 leading-relaxed">
              <p>
                Pensando e ouvindo nossos clientes no dia a dia, percebemos que poderíamos ajudar muito mais do que apenas fornecendo a ferramenta de gestão do negócio (o Aplicativo). Por isso, conversamos pessoalmente com cada um dos nossos parceiros para que todos os nossos clientes tenham um <strong>atendimento especial e diferenciado</strong>.
              </p>
              <p>
                Além disso, deixamos aqui o nosso contato direto caso você esteja com dificuldade para finalizar o seu aplicativo e começar a usar — seja por falta de tempo ou por qualquer dúvida na configuração, você também tem a possibilidade de contratar nosso serviço para deixar tudo pronto para você.
              </p>
              <p>
                E, para impulsionar a divulgação do seu negócio, também contamos com <strong>parceiros especializados na produção de vídeos profissionais</strong> para você divulgar o seu aplicativo nas redes sociais.
              </p>
              <p>
                Estamos <strong>sempre atualizando esta página</strong>, pois toda semana fechamos parcerias com novas empresas. Caso você sinta que precisa de algum produto ou serviço específico para o seu negócio, fique à vontade para nos falar — vamos buscar fazer novas parcerias para poder sempre ajudar você da melhor forma possível!
              </p>
            </div>
          </div>
        </section>

        {/* Box Serviço Opcional de Cadastro de Cardápio (Imagem 8 - título atualizado) */}
        <section id="cardapio-suporte" className="mb-5 sm:mb-6 scroll-mt-6">
          <div className="bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#A38C66]/40 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-5">
            <div className="flex items-start gap-3 sm:gap-3.5">
              <img
                src="https://raw.githubusercontent.com/easybyzcreator/imagens/92cb499e86868ed1f22fe1399da839537a9e3695/icone%20alerta.png"
                alt="Alerta"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 mt-0.5"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base md:text-xl text-[#424733] leading-snug">
                  Não tem tempo para inserir o seu cardápio no app ou tem dificuldade e gostaria que nós fizéssemos isso por você?
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-[#424733]/85 leading-relaxed">
                  Sim, isso é possível! Entre em contato e solicite um orçamento desse serviço para receber seu cardápio pronto no aplicativo.
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#424733]/60 font-medium">
                  Serviço opcional a partir de R$ 97,00 (o valor varia conforme a quantidade de itens do cardápio e pode ser parcelado em até 2 vezes).
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${EASYBYZ_WHATSAPP}?text=${encodeURIComponent(
                'Olá Pati, estou acessando a página de Parceiros e Suporte Easy Byz, mas gostaria de solicitar um orçamento para que você pudesse me entregar o meu cardápio pronto.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-[#613C26] hover:bg-[#859159] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Solicitar Orçamento</span>
            </a>
          </div>
        </section>

        {/* Box Opcional: Vídeo Profissional com Especialista (Imagem 10) */}
        <section className="mb-10 sm:mb-12">
          <div className="bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#859159]/45 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-5">
            <div className="flex items-start gap-3 sm:gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#859159]/15 border border-[#859159]/30 text-[#424733] flex items-center justify-center shrink-0 mt-0.5">
                <Video className="w-5 h-5 text-[#613C26]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base md:text-xl text-[#424733] leading-snug">
                  Quer um vídeo profissional feito por um especialista para divulgar o seu cardápio no aplicativo?
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-[#424733]/85 leading-relaxed">
                  Nós temos como parceira a pessoa ideal que pode te ajudar nessa etapa. Caso tenha interesse, clique aqui e fale com a gente!
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#424733]/65 font-medium">
                  Valores a partir de R$ 150,00/vídeo
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${EASYBYZ_WHATSAPP}?text=${encodeURIComponent(
                'Olá Pati, sou aluna da chef Gabi e gostaria de ter uma profissional fazendo o meu vídeo de divulgação do cardápio.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-[#859159] hover:bg-[#613C26] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Falar com a gente</span>
            </a>
          </div>
        </section>

        {/* Catálogo Completo de Parceiros EasyByz (Imagem 11 / 3) */}
        <section id="parceiros-catalogo" className="mb-10 sm:mb-12 scroll-mt-6">
          <PartnersPage embedded />
        </section>

        {/* Card de Inspirações: Vídeos de Alunas no Instagram (Imagem 13) */}
        <section className="mb-6 sm:mb-8">
          <div className="bg-[#FAF8F5] border sm:border-2 border-[#A38C66]/45 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-7 shadow-2xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#613C26] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase text-[#859159] tracking-wider block">
                  Exemplos Reais de Inspiração
                </span>
                <h4 className="text-sm sm:text-base md:text-lg font-black text-[#424733] leading-snug">
                  Veja vídeos de outras alunas para se inspirar e ter ideias
                </h4>
                <p className="text-xs sm:text-sm text-[#424733]/85 leading-relaxed">
                  Selecionamos exemplos reais seguindo exatamente as coordenadas acima de como apresentar o cardápio e o aplicativo. Clique em qualquer vídeo abaixo para assistir aqui mesmo sem sair da página:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {INSPIRATION_VIDEOS.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setSelectedInspirationVideo(video)}
                  className={cn(
                    'bg-white hover:bg-[#FAF8F5] border border-[#A38C66]/35 hover:border-[#613C26] rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-sm',
                    index === 0 && 'sm:col-span-2 border-[#859159]/50 bg-[#859159]/[0.04]'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#859159]/15 group-hover:bg-[#613C26] text-[#613C26] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#859159]">
                          {video.label}
                        </span>
                        {video.highlight && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#859159]/15 border border-[#859159]/35 text-[#424733] text-[10px] font-bold">
                            <Sparkles className="w-2.5 h-2.5 text-[#859159] shrink-0" />
                            <span>{video.highlight}</span>
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-xs sm:text-sm text-[#424733] group-hover:text-[#613C26] truncate transition-colors mt-0.5">
                        {video.brand}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] group-hover:bg-[#613C26] text-[#424733] group-hover:text-white border border-[#A38C66]/30 group-hover:border-[#613C26] text-[11px] sm:text-xs font-bold shrink-0 transition-colors">
                    <span>Assistir</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Card do App de Simulação da Escola (Imagem 9 - posicionado acima do rodapé) */}
        <section id="app-simulacao" className="scroll-mt-6">
          <div className="bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-[#859159]/40 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#859159]/20 text-[#859159] flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-extrabold text-xs sm:text-sm md:text-base text-[#424733]">
                    App de Simulação da Escola (Sugestões de Mensagens)
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs md:text-sm text-[#424733]/80 leading-relaxed max-w-2xl">
                  Acesse o aplicativo de simulação da Chef Gabi para ver sugestões de mensagens, textos de pedidos e exemplos práticos para o seu cardápio.
                </p>
              </div>
            </div>

            <a
              href="https://egn-chefgabipaludo.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#859159] hover:bg-[#613C26] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-2xs hover:shadow-xs flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 group whitespace-nowrap"
            >
              <span>Ver App de Simulação</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer com Identidade EGN & EASY BYZ (Preservado e Proporcional) */}
      <footer className="border-t border-[#A38C66]/30 bg-[#424733] py-8 sm:py-12 px-4 text-[#F0F0F0] text-center text-xs sm:text-sm">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
          {/* Logo EASY BYZ no Rodapé */}
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs text-[#F0F0F0] uppercase tracking-wider font-semibold">
              Desenvolvido & Comercializado por
            </span>
            <a
              href="https://links-easybyzcreator.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-90 transition-opacity"
              title="EASY BYZ"
            >
              <TintedFooterLogo />
            </a>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <p className="font-extrabold text-sm sm:text-base md:text-lg text-[#F0F0F0]">
              EGN - Escola de Gastronomia e Negócios
            </p>
            <p className="text-[11px] sm:text-xs text-[#A38C66] max-w-md mx-auto">
              Aplicativo estruturado sob a metodologia oficial da EGN e desenvolvido com tecnologia EASY BYZ.
            </p>
          </div>

          {/* Botão de Dúvidas EASY BYZ (+1 803 888 9018) */}
          <div className="pt-1">
            <a
              href={`https://wa.me/${EASYBYZ_WHATSAPP}?text=${encodeURIComponent(DEFAULT_SUPPORT_MSG)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-5 py-3 sm:px-6 sm:py-3.5 bg-[#613C26] hover:bg-[#859159] text-white border border-[#A38C66]/40 rounded-xl sm:rounded-full text-center transition-all shadow-sm hover:shadow-md w-full sm:w-auto max-w-sm mx-auto group"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#A38C66] shrink-0 group-hover:text-white transition-colors" />
              <div className="flex flex-col text-left sm:text-center">
                <span className="text-[11px] sm:text-xs font-semibold text-[#F0F0F0]/90 leading-tight">
                  Dúvidas sobre o aplicativo?
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white leading-tight mt-0.5">
                  Falar com a Pati (Easy Byz) no WhatsApp
                </span>
              </div>
            </a>
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#F0F0F0]/50 pt-2 sm:pt-4">
            © 2026 EASY BYZ & EGN. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Modal Pop-up para Assistir Vídeos de Inspiração do Instagram na Própria Página */}
      <AnimatePresence>
        {selectedInspirationVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs"
            onClick={() => setSelectedInspirationVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border-2 border-[#A38C66]/45 shadow-2xl p-4 sm:p-5 max-h-[92vh] flex flex-col gap-3"
            >
              {/* Cabeçalho do Pop-up */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#859159] block">
                    {selectedInspirationVideo.label} • Inspiração
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#424733] leading-tight truncate">
                    {selectedInspirationVideo.brand}
                  </h3>
                  {selectedInspirationVideo.highlight && (
                    <p className="text-[11px] text-[#613C26] font-semibold">
                      {selectedInspirationVideo.highlight}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInspirationVideo(null)}
                  className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#F0F0F0] text-[#424733] border border-[#A38C66]/35 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  aria-label="Fechar vídeo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Player Embed do Instagram */}
              <div className="w-full h-[460px] sm:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden border border-[#A38C66]/30 bg-[#FAF8F5]">
                <iframe
                  src={`https://www.instagram.com/p/${selectedInspirationVideo.shortcode}/embed/`}
                  title={`Vídeo de inspiração - ${selectedInspirationVideo.brand}`}
                  className="w-full h-full border-0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Rodapé do Pop-up: Botão Rápido de Voltar + Fallback Instagram */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedInspirationVideo(null)}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#613C26] hover:bg-[#859159] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Fechar e voltar para a página
                </button>

                <a
                  href={selectedInspirationVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F0F0F0] text-[#424733] border border-[#A38C66]/35 font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  <span>Abrir no Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
