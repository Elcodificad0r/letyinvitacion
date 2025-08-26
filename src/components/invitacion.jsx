import { useState, useEffect } from 'react';
import { Menu, X, MapPin, Gift, Camera, Send, Heart, GraduationCap } from 'lucide-react';


export default function Invitacion() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer para el 5 de octubre 2025
  useEffect(() => {
    const targetDate = new Date('2025-10-05T18:00:00').getTime();
    
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
    '/api/placeholder/300/200',
    '/api/placeholder/300/200',
    '/api/placeholder/300/200',
    '/api/placeholder/300/200',
    '/api/placeholder/300/200'
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

  const handleFormSubmit = () => {
    // Validación básica
    if (!formData.name || !formData.attending) {
      alert('Por favor completa los campos requeridos');
      return;
    }
    
    // Aquí conectarías con Firebase
    console.log('Form data:', formData);
    alert('¡Gracias por confirmar tu asistencia!');
    setFormData({ name: '', attending: '', guests: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-rose-800">Leticia Salinas</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-rose-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} className="text-rose-800" /> : <Menu size={24} className="text-rose-800" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t">
            {['presentacion', 'lugar', 'vestimenta', 'regalos', 'galeria', 'asistencia'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="w-full px-4 py-3 text-left hover:bg-rose-50 capitalize transition-colors text-rose-800"
              >
                {section === 'presentacion' ? 'Inicio' : section}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="presentacion" className="pt-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <GraduationCap className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-rose-800 mb-2">¡Celebremos Juntos!</h2>
          <h3 className="text-2xl font-serif italic text-amber-700 mb-4">Jubilación de Leticia Salinas</h3>
          <p className="text-rose-700 mb-6 leading-relaxed">
            Después de <strong>65 años</strong> dedicados con pasión y entrega a la educación, 
            queremos honrar su extraordinaria trayectoria con una celebración especial.
          </p>
          
          {/* Photo Placeholder */}
          <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-rose-200 shadow-lg">
            <img 
              src="/api/placeholder/200/200" 
              alt="Leticia Salinas" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Countdown Timer */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
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
      <section id="lugar" className="px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <MapPin className="text-rose-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-rose-800">Lugar y Fecha</h3>
          </div>
          <div className="space-y-3 text-rose-700">
            <p><strong>Fecha:</strong> 5 de Octubre, 2025</p>
            <p><strong>Hora:</strong> 6:00 PM</p>
            <p><strong>Lugar:</strong> Expo Unión Ganadera Regional de Nuevo León</p>
          </div>
          <button 
            onClick={() => window.open('https://maps.google.com', '_blank')}
            className="w-full mt-4 bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center"
          >
            <MapPin className="mr-2" size={18} />
            Ver en Mapa
          </button>
        </div>
      </section>

      {/* Dress Code Section */}
      <section id="vestimenta" className="px-4 py-8 bg-rose-50/50">
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
      <section id="regalos" className="px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Gift className="text-rose-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-rose-800">Regalo</h3>
          </div>
          <div className="text-center">
            <Heart className="w-12 h-12 text-rose-400 mx-auto mb-3" />
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
      <section id="galeria" className="px-4 py-8 bg-rose-50/50">
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
      <section id="asistencia" className="px-4 py-8">
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
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="">Selecciona una opción</option>
                <option value="yes">Sí, asistiré</option>
                <option value="no">No podré asistir</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-700 mb-1">
                Número de Acompañantes
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: e.target.value})}
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Comparte un mensaje especial..."
              />
            </div>

            <button
              onClick={handleFormSubmit}
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center"
            >
              <Send className="mr-2" size={18} />
              Enviar Confirmación
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
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