import { MapPin, MessageCircle, Phone, Clock, Mail } from 'lucide-react';

export default function Contact() {
  const storeName = import.meta.env.VITE_STORE_NAME || 'Mi Tienda';
  const storeAddress = import.meta.env.VITE_STORE_ADDRESS || 'Dirección de la Tienda';
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';

  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const phoneLink = `tel:${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contáctanos</h1>
          <p className="text-lg text-gray-600">
            Estamos aquí para ayudarte. Contáctanos por cualquier consulta.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
            
            <div className="space-y-6">
              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Enviar mensaje
                  </a>
                  <p className="text-sm text-gray-500 mt-1">{whatsappNumber}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Teléfono</h3>
                  <a
                    href={phoneLink}
                    className="text-slate-600 hover:text-slate-800 font-medium"
                  >
                    Llamar ahora
                  </a>
                  <p className="text-sm text-gray-500 mt-1">{whatsappNumber}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dirección</h3>
                  <p className="text-gray-600">{storeAddress}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Horario</h3>
                  <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                  <p className="text-gray-600">Sábados: 10:00 - 14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-center">
            <MessageCircle className="w-16 h-16 mb-6 opacity-90" />
            <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas?</h2>
            <p className="text-green-100 mb-8 leading-relaxed">
              Contáctanos por WhatsApp para una respuesta rápida. Estamos listos para ayudarte con tu pedido.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-green-600 hover:bg-green-50 py-4 px-8 rounded-xl font-semibold transition-colors text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar mensaje
            </a>
          </div>
        </div>

        {/* Store Info */}
        <div className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">{storeName}</h2>
          <p className="text-gray-300">Gracias por visitarnos</p>
        </div>
      </div>
    </div>
  );
}
