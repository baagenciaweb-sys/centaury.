import { MapPin, MessageCircle, Phone, Clock, Mail } from 'lucide-react';

export default function Contact() {
  const storeName = import.meta.env.VITE_STORE_NAME || 'Mi Tienda';
  const storeAddress = import.meta.env.VITE_STORE_ADDRESS || 'Direccion de la Tienda';
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';

  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const phoneLink = `tel:${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(2,6,23,0.95),_rgba(15,23,42,0.98))]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 rounded-[32px] border border-white/10 bg-black/20 px-8 py-8 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur-sm">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5">Contactanos</h1>
          <p className="text-2xl sm:text-3xl text-slate-300 leading-relaxed">
            Estamos aqui para ayudarte. Contactanos por cualquier consulta.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Card */}
          <div className="rounded-[28px] border border-white/10 bg-white/95 shadow-[0_0_35px_rgba(0,0,0,0.35)] p-10">
            <div className="space-y-8">
              {/* WhatsApp */}
              <div className="flex items-start gap-5 rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-3xl sm:text-4xl">WhatsApp</h3>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-semibold text-xl"
                  >
                    Enviar mensaje
                  </a>
                  <p className="text-xl text-gray-500 mt-2">{whatsappNumber}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5 rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-3xl sm:text-4xl">Telefono</h3>
                  <a
                    href={phoneLink}
                    className="text-slate-600 hover:text-slate-800 font-semibold text-xl"
                  >
                    Llamar ahora
                  </a>
                  <p className="text-xl text-gray-500 mt-2">{whatsappNumber}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-5 rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-3xl sm:text-4xl">Direccion</h3>
                  <p className="text-gray-600 text-xl leading-relaxed">{storeAddress}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-5 rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-7 h-7 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-3xl sm:text-4xl">Horario</h3>
                  <p className="text-gray-600 text-xl leading-relaxed">Lunes a Viernes: 9:00 - 18:00</p>
                  <p className="text-gray-600 text-xl leading-relaxed">Sabados: 10:00 - 14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="relative overflow-hidden rounded-[28px] border border-emerald-300/40 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.45),_transparent_35%),linear-gradient(135deg,_#052e16_0%,_#065f46_45%,_#022c22_100%)] p-8 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_40px_rgba(16,185,129,0.22),0_20px_60px_rgba(0,0,0,0.35)] flex flex-col justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.18),_transparent_60%)] opacity-60" />
            <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-400/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <h2 className="text-5xl sm:text-6xl font-bold mb-4 tracking-wide text-emerald-50">Tienes preguntas?</h2>
              <p className="text-emerald-100/95 mb-8 leading-relaxed text-2xl sm:text-3xl">
                Contactanos por WhatsApp para una respuesta rapida. Estamos listos para ayudarte con tu pedido.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-[0_0_20px_rgba(110,231,183,0.25)] backdrop-blur-sm">
                  <MessageCircle className="w-8 h-8 text-emerald-200" />
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white text-emerald-700 hover:bg-emerald-50 py-5 px-10 rounded-xl font-semibold transition-all duration-300 text-xl shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar mensaje
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3">{storeName}</h2>
          <p className="text-gray-300 text-2xl">Gracias por visitarnos</p>
        </div>
      </div>
    </div>
  );
}
