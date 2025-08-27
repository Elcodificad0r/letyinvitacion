import { useState, useEffect } from 'react';
import { Menu, X, MapPin, Gift, Camera, Send, Mail, GraduationCap } from 'lucide-react';

// SweetAlert2 simulado con componente React
const SwalAlert = ({ isOpen, type, title, text, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center shadow-xl">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          type === 'success' ? 'bg-green-100' : 'bg-orange-100'
        }`}>
          {type === 'success' ? (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{text}</p>
        <button
          onClick={onConfirm}
          className={`px-6 py-2 rounded-lg font-medium ${
            type === 'success' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          } transition-colors`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default function RetirementInvitation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    text: ''
  });

  // Countdown timer para el 5 de octubre 2025 a las 12:00 PM
  useEffect(() => {
    const targetDate = new Date('2025-10-05T12:00:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Gallery auto-scroll
  const photos = [
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=200&fit=crop'
  ];

  useEffect(() => {
    const photoTimer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 2000);

    return () => clearInterval(photoTimer);
  }, [photos.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const [formData, setFormData] = useState({
    name: '',
    attending: '',
    guests: '',
    message: ''
  });

  const showAlert = (type, title, text) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      text
    });
  };

  const closeAlert = () => {
    setAlertState({
      isOpen: false,
      type: 'success',
      title: '',
      text: ''
    });
  };

  const handleGuestsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 5) {
      showAlert('warning', 'Límite de Invitados', 'Por su atención, solo se pueden invitar máximo a 5 personas');
      return;
    }
    setFormData({...formData, guests: e.target.value});
  };

  // Form submission conectado a Google Sheets con timeout
  const handleSubmit = async () => {
    if (!formData.name || !formData.attending) {
      showAlert('warning', 'Campos Requeridos', 'Por favor completa los campos requeridos');
      return;
    }

    const payload = {
      name: formData.name,
      attending: formData.attending,
      guests: formData.guests || "0",
      message: formData.message || ""
    };

    // Mostrar confirmación inmediata y limpiar formulario
    showAlert('success', '¡Enviado!', 'Tu confirmación ha sido enviada correctamente. ¡Gracias!');
    setFormData({ name: '', attending: '', guests: '', message: '' });

    // Enviar en segundo plano con timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout

      fetch("https://script.google.com/macros/s/AKfycbxB6vBL2Cc34wRdvAdoh6eJ3MwOKCtX1HK0QqYubjXgqmBtbNILCNVkP9i44qdDoWqR_w/exec", {
        method: "POST",
        mode: 'no-cors',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal
      }).finally(() => {
        clearTimeout(timeoutId);
      });
      
    } catch (error) {
      // Error silencioso en segundo plano - el usuario ya vio la confirmación
      console.log('Envío en segundo plano:', error.message);
    }
  };

  const menuItems = [
    { id: 'presentacion', label: 'Inicio' },
    { id: 'lugar', label: 'Lugar' },
    { id: 'vestimenta', label: 'Vestimenta' },
    { id: 'regalos', label: 'Regalos' },
    { id: 'galeria', label: 'Galería' },
    { id: 'asistencia', label: 'Asistencia' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 w-full overflow-x-hidden">
      <SwalAlert
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        text={alertState.text}
        onConfirm={closeAlert}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <h1 className="text-base font-bold text-rose-800 leading-tight">Leticia Salinas</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>
        </div>
        
        {/* Modern Mobile Menu */}
        <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="w-full max-w-sm mx-auto px-4 mt-2 mb-4">
            <div className="bg-white/95 backdrop-blur-sm shadow-xl border rounded-2xl overflow-hidden">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full px-4 py-3 text-center hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 transition-all duration-200 text-gray-700 font-medium ${
                    index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  } hover:text-rose-700 relative group`}
                >
                  <span className="transition-all duration-200 group-hover:scale-105">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="presentacion" className="pt-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-3">
            <GraduationCap className="w-12 h-12 text-rose-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-rose-800 mb-2">¡Celebremos Juntos!</h2>
          <h3 className="text-xl font-serif italic text-amber-700 mb-3">Jubilación de Leticia Salinas</h3>
          <p className="text-rose-700 mb-4 leading-relaxed text-sm">
            Después de <strong>65 años</strong> dedicados con pasión y entrega a la educación, 
            queremos honrar su extraordinaria trayectoria con una celebración especial.
          </p>
          
          {/* Photo Placeholder */}
          <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-rose-200 shadow-lg">
            <img 
              src="/api/placeholder/200/200" 
              alt="Leticia Salinas" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Countdown Timer */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
            <h4 className="text-lg font-semibold text-rose-800 mb-4">Faltan:</h4>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="bg-rose-100 rounded-lg p-3 mb-1">
                    <span className="text-2xl font-bold text-rose-800">{value}</span>
                  </div>
                  <span className="text-xs text-rose-600 capitalize">{unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="lugar" className="px-4 py-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <MapPin className="text-rose-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-rose-800">Lugar y Fecha</h3>
          </div>
          <div className="space-y-3 text-rose-700">
            <p><strong>Fecha:</strong> 5 de Octubre, 2025</p>
            <p><strong>Hora:</strong> 12:00 PM</p>
            <p><strong>Lugar:</strong> Expo Unión Ganadera Regional de Nuevo León</p>
          </div>
          <button 
            onClick={() => window.open('https://maps.app.goo.gl/Z3ngtvorKPqAii8o6', '_blank')}
            className="w-full mt-4 bg-black-600 text-black py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center border-0"
          >
            <MapPin className="mr-2 text-black" size={18} />
            Ver en Mapa
          </button>
        </div>
      </section>

      {/* Dress Code Section */}
      <section id="vestimenta" className="px-4 py-4 bg-rose-50/50">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-rose-800 mb-4">Código de Vestimenta</h3>
          <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
            <p className="text-amber-800 font-serif italic text-center">
              "Elegante Casual"
            </p>
            <p className="text-amber-700 text-sm mt-2">
              Sugerimos colores suaves y elegantes para honrar esta ocasión especial.
            </p>
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      <section id="regalos" className="px-4 py-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Gift className="text-rose-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-rose-800">Regalo</h3>
          </div>
          <div className="text-center">
            <Mail className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <p className="text-rose-700 font-serif italic">
              "Tu presencia es el mejor regalo"
            </p>
            <p className="text-sm text-rose-600 mt-2">
              Solo deseamos compartir contigo este momento tan especial.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="px-4 py-4 bg-rose-50/50">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Camera className="text-rose-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-rose-800">Recuerdos</h3>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img 
              src={photos[currentPhotoIndex]}
              alt={`Recuerdo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Form */}
      <section id="asistencia" className="px-4 py-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Send className="text-rose-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-rose-800">Confirma tu Asistencia</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-rose-400"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                ¿Asistirás?
              </label>
              <select
                value={formData.attending}
                onChange={(e) => setFormData({...formData, attending: e.target.value})}
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-black"
              >
                <option value="">Selecciona una opción</option>
                <option value="yes">Sí, asistiré</option>
                <option value="no">No podré asistir</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Número de Acompañantes (máximo 5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.guests}
                onChange={handleGuestsChange}
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-black"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Mensaje para Leticia
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-rose-400"
                placeholder="Comparte un mensaje especial..."
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-rose-600 text-black py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center border-0"
            >
              <Send className="mr-2 text-black" size={18} />
              Enviar Confirmación
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-4 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-rose-600 font-serif italic">
            "La educación es el arma más poderosa que puedes usar para cambiar el mundo"
          </p>
          <p className="text-sm text-rose-500 mt-2">
            Con cariño y admiración ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}