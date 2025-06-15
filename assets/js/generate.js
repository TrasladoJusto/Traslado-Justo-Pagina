/**
 * generate.js - Generación del sitio web
 * Maneja la generación del HTML, CSS y JS del sitio web final
 */

// Configuración de plantillas HTML
const templateHTMLs = {
  restaurant: (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.business.name} - Restaurante</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: auto !important;
      box-sizing: border-box;
      background: #fff;
    }
    body {
      min-height: 100vh;
      max-width: 100vw;
      overflow-x: hidden !important;
      position: relative;
    }
    .header, .navbar, .footer, .container, .main, .section {
      box-sizing: border-box;
      max-width: 100vw;
      overflow-x: hidden;
    }
  </style>
</head>
<body>
  <!-- Header con logo, slogan y menú de navegación -->
  <header class="header">
    <nav class="navbar">
    <div class="container">
      <div class="logo">
          <h1>${data.business.name}</h1>
          ${data.business.slogan ? `<p class="slogan">${data.business.slogan}</p>` : ''}
      </div>
        <ul class="nav-menu">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#carta">Carta</a></li>
          <li><a href="#galeria">Galería</a></li>
          <li><a href="#testimonios">Testimonios</a></li>
          <li><a href="#reservas">Reservas</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
    </div>
    </nav>
  </header>

  <main>
    <!-- Portada con foto destacada -->
    <section id="inicio" class="hero">
      <div class="hero-background" style="background-image: url('${data.extractedData?.realPhotos?.[0]?.url || data.extractedData?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=600&fit=crop'}');">
        <div class="hero-overlay"></div>
          </div>
          <div class="container">
        <div class="hero-content">
          <h2>Vive una experiencia inolvidable</h2>
          <p>${data.business.description || 'Disfruta de la mejor experiencia culinaria.'}</p>
          <a href="#reservas" class="btn btn-primary">Reservar</a>
            </div>
          </div>
        </section>
        
    <!-- Sección Carta/Menu -->
    <section id="carta" class="menu-section">
          <div class="container">
        <h2>Nuestra Carta</h2>
        <div class="menu-grid">
          ${(data.extractedData?.menu || []).map((item, idx) => `
            <div class="menu-item">
              <div class="menu-image" style="background-image: url('${item.photo || data.extractedData?.realPhotos?.[idx+1]?.url || data.extractedData?.photos?.[idx+1]?.url || ''}');"></div>
              <h3>${item.name}</h3>
              <p>${item.description || ''}</p>
              <span class="price">${item.price || ''}</span>
            </div>
          `).join('') || '<p>Pronto publicaremos nuestra carta completa.</p>'}
            </div>
          </div>
        </section>
        
    <!-- Galería de fotos -->
    <section id="galeria" class="gallery-section">
          <div class="container">
        <h2>Galería</h2>
        <div class="gallery-grid">
          ${(data.extractedData?.realPhotos || data.extractedData?.photos || []).map(photo => `
            <div class="gallery-photo">
              <img src="${photo.url}" alt="${photo.alt || ''}" loading="lazy" />
                  </div>
          `).join('')}
            </div>
          </div>
        </section>

    <!-- Sección ambiente/local -->
    <section id="ambiente" class="about-section">
          <div class="container">
            <div class="about-content">
              <div class="about-text">
            <h2>Nuestro Local</h2>
            <p>${data.extractedData?.about || 'Ambiente único junto al mar, salón con vistas, bar y terraza.'}</p>
              </div>
          <div class="about-image" style="background-image: url('${data.extractedData?.realPhotos?.[2]?.url || data.extractedData?.photos?.[2]?.url || ''}');"></div>
            </div>
          </div>
        </section>
        
    <!-- Testimonios -->
    <section id="testimonios" class="testimonials-section">
          <div class="container">
        <h2>Testimonios</h2>
        <div class="testimonials-grid">
          ${(data.extractedData?.reviews || []).map(review => `
            <div class="testimonial">
              <p>"${review.text}"</p>
              <span>- ${review.author || review.author_name}</span>
              </div>
          `).join('') || '<p>Aún no hay testimonios.</p>'}
            </div>
          </div>
        </section>
        
    <!-- Reservas -->
    <section id="reservas" class="reservation-section">
          <div class="container">
        <h2>Reservas</h2>
        <form class="reservation-form">
          <input type="text" placeholder="Nombre" required>
          <input type="email" placeholder="Email" required>
          <input type="tel" placeholder="Teléfono" required>
          <input type="date" required>
          <input type="time" required>
          <textarea placeholder="Mensaje o requerimientos especiales" rows="3"></textarea>
          <button type="submit" class="btn btn-primary">Reservar</button>
        </form>
          </div>
        </section>
        
    <!-- Contacto -->
        <section id="contacto" class="contact-section">
          <div class="container">
        <h2>Contacto</h2>
        <div class="contact-grid">
              <div class="contact-info">
            <h3>Información de Contacto</h3>
            <div class="contact-item"><i class="fas fa-map-marker-alt"></i> <span>${data.contact.address || ''}</span></div>
            <div class="contact-item"><i class="fas fa-phone"></i> <span>${data.contact.phone || ''}</span></div>
            <div class="contact-item"><i class="fas fa-envelope"></i> <span>${data.contact.email || ''}</span></div>
            <div class="contact-item"><i class="fas fa-globe"></i> <span>${data.contact.website || ''}</span></div>
              </div>
            </div>
          </div>
        </section>
  </main>
      
  <footer class="footer">
          <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>${data.business.name}</h3>
          <p>${data.business.description || ''}</p>
            </div>
        <div class="footer-section">
          <h3>Redes Sociales</h3>
          <div class="social-links">
            ${data.social.instagram ? `<a href="${data.social.instagram}"><i class="fab fa-instagram"></i></a>` : ''}
            ${data.social.facebook ? `<a href="${data.social.facebook}"><i class="fab fa-facebook"></i></a>` : ''}
          </div>
        </div>
              </div>
      <div class="footer-bottom">
        <p>&copy; 2024 ${data.business.name}. Todos los derechos reservados.</p>
              </div>
            </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
  `,

  cafe: (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.business.name} - Café</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
          <div class="container">
                <div class="logo">
                    <h1>${data.business.name}</h1>
                    ${data.business.slogan ? `<p class="slogan">${data.business.slogan}</p>` : ''}
                </div>
                <ul class="nav-menu">
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#menu">Carta</a></li>
                    <li><a href="#galeria">Galería</a></li>
                    <li><a href="#nosotros">Nosotros</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                  </ul>
                  </div>
        </nav>
    </header>
      
    <main>
        <section id="inicio" class="hero">
            <div class="hero-background" style="background-image: url('${data.extractedData?.realPhotos?.[0]?.url || data.extractedData?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=600&fit=crop'}');">
                <div class="hero-overlay"></div>
                </div>
            <div class="container">
                <div class="hero-content">
                    <h2>Amor por la música, aroma de café y gente cálida</h2>
                    <p>${data.business.description || 'Un café con ambiente único y productos de calidad.'}</p>
                    <a href="#menu" class="btn btn-primary">Ver Carta</a>
              </div>
                </div>
        </section>
        
        <section id="menu" class="menu-section">
          <div class="container">
                <h2>Nuestra Carta</h2>
                <div class="menu-grid">
                    ${(data.extractedData?.menu || []).map(item => `
                      <div class="menu-item">
                        <div class="menu-image" style="background-image: url('${item.photo || data.extractedData?.realPhotos?.[1]?.url || data.extractedData?.photos?.[1]?.url || ''}');"></div>
                        <h3>${item.name}</h3>
                        <p>${item.description || ''}</p>
                        <span class="price">${item.price || ''}</span>
                  </div>
                    `).join('') || '<p>Pronto publicaremos nuestra carta completa.</p>'}
            </div>
          </div>
        </section>
        
        <section id="galeria" class="gallery-section">
          <div class="container">
                <h2>Galería</h2>
                <div class="gallery-grid">
                    ${(data.extractedData?.realPhotos || data.extractedData?.photos || []).map(photo => `
                      <div class="gallery-photo">
                        <img src="${photo.url}" alt="${photo.alt || ''}" loading="lazy" />
                      </div>
                    `).join('')}
            </div>
          </div>
        </section>
        
        <section id="nosotros" class="about-section">
          <div class="container">
                <div class="about-content">
                    <div class="about-text">
                        <h2>Sobre Nosotros</h2>
                        <p>${data.extractedData?.about || 'Un lugar acogedor para disfrutar café, postres y buena compañía.'}</p>
                  </div>
                    <div class="about-image" style="background-image: url('${data.extractedData?.realPhotos?.[2]?.url || data.extractedData?.photos?.[2]?.url || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop'}');"></div>
            </div>
          </div>
        </section>
        
        <section id="contacto" class="contact-section">
          <div class="container">
            <h2>Contacto</h2>
                <div class="contact-grid">
              <div class="contact-info">
                <h3>Información de Contacto</h3>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${data.contact.address || 'Dirección no especificada'}</span>
              </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${data.contact.phone || 'Teléfono no especificado'}</span>
                  </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${data.contact.email || 'Email no especificado'}</span>
                  </div>
          <div class="contact-item">
            <i class="fas fa-globe"></i>
            <span>${data.contact.website || 'Sitio web no especificado'}</span>
                  </div>
                  </div>
                    <div class="contact-form">
                        <h3>Envíanos un Mensaje</h3>
                        <form>
                            <input type="text" placeholder="Nombre" required>
                            <input type="email" placeholder="Email" required>
                            <textarea placeholder="Mensaje" rows="5" required></textarea>
                            <button type="submit" class="btn btn-primary">Enviar</button>
                </form>
              </div>
            </div>
          </div>
        </section>
    </main>

    <footer class="footer">
          <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${data.business.name}</h3>
                    <p>${data.business.description || 'Descripción del negocio'}</p>
          </div>
                <div class="footer-section">
                    <h3>Redes Sociales</h3>
                    <div class="social-links">
                        ${data.social.instagram ? `<a href="${data.social.instagram}"><i class="fab fa-instagram"></i></a>` : ''}
                        ${data.social.facebook ? `<a href="${data.social.facebook}"><i class="fab fa-facebook"></i></a>` : ''}
        </div>
              </div>
              </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${data.business.name}. Todos los derechos reservados.</p>
            </div>
          </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
  `,

  // Plantillas similares para otros tipos de negocio...
  default: (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.business.name}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
          <div class="container">
                <div class="logo">
                    <h1>${data.business.name}</h1>
                    ${data.business.slogan ? `<p class="slogan">${data.business.slogan}</p>` : ''}
            </div>
                <ul class="nav-menu">
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#servicios">Servicios</a></li>
                    <li><a href="#nosotros">Nosotros</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                </ul>
            </div>
        </nav>
    </header>
        
    <main>
        <section id="inicio" class="hero">
            <div class="hero-background" style="background-image: url('${data.extractedData?.realPhotos?.[0]?.url || data.extractedData?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop'}');">
                <div class="hero-overlay"></div>
            </div>
          <div class="container">
                <div class="hero-content">
                    <h2>Bienvenidos a ${data.business.name}</h2>
                    <p>${data.business.description || 'Descripción del negocio'}</p>
                    <a href="#servicios" class="btn btn-primary">Nuestros Servicios</a>
            </div>
          </div>
        </section>
        
        <section id="servicios" class="services-section">
          <div class="container">
                <h2>Nuestros Servicios</h2>
                <div class="services-grid">
                    <div class="service-item">
                        <div class="service-image" style="background-image: url('${data.extractedData?.realPhotos?.[0]?.url || data.extractedData?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'}');"></div>
                        <i class="fas fa-cog"></i>
                        <h3>Servicio 1</h3>
                        <p>Descripción del servicio</p>
                  </div>
                    <div class="service-item">
                        <div class="service-image" style="background-image: url('${data.extractedData?.realPhotos?.[1]?.url || data.extractedData?.photos?.[1]?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'}');"></div>
                        <i class="fas fa-tools"></i>
                        <h3>Servicio 2</h3>
                        <p>Descripción del servicio</p>
                  </div>
                    <div class="service-item">
                        <div class="service-image" style="background-image: url('${data.extractedData?.realPhotos?.[2]?.url || data.extractedData?.photos?.[2]?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'}');"></div>
                        <i class="fas fa-star"></i>
                        <h3>Servicio 3</h3>
                        <p>Descripción del servicio</p>
                  </div>
            </div>
          </div>
        </section>
        
        <section id="nosotros" class="about-section">
          <div class="container">
                <div class="about-content">
                    <div class="about-text">
            <h2>Sobre Nosotros</h2>
                        <p>${data.business.description || 'Descripción del negocio'}</p>
          </div>
                    <div class="about-image" style="background-image: url('${data.extractedData?.realPhotos?.[1]?.url || data.extractedData?.photos?.[1]?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop'}');"></div>
            </div>
          </div>
        </section>
        
        <section id="contacto" class="contact-section">
          <div class="container">
            <h2>Contacto</h2>
                <div class="contact-grid">
                    <div class="contact-info">
                        <h3>Información de Contacto</h3>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${data.contact.address || 'Dirección no especificada'}</span>
                  </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${data.contact.phone || 'Teléfono no especificado'}</span>
                  </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${data.contact.email || 'Email no especificado'}</span>
                  </div>
                  </div>
            </div>
          </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${data.business.name}</h3>
                    <p>${data.business.description || 'Descripción del negocio'}</p>
        </div>
                <div class="footer-section">
                    <h3>Redes Sociales</h3>
                    <div class="social-links">
                        ${data.social.instagram ? `<a href="${data.social.instagram}"><i class="fab fa-instagram"></i></a>` : ''}
                        ${data.social.facebook ? `<a href="${data.social.facebook}"><i class="fab fa-facebook"></i></a>` : ''}
        </div>
      </div>
        </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${data.business.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
  `
};

/**
 * Genera el CSS del sitio web
 */
function generateCSS(data) {
  const primaryColor = data.design.primaryColor || '#3b82f6';
  const secondaryColor = data.design.secondaryColor || '#f59e0b';
  const accentColor = data.design.accentColor || '#10b981';
  const textColor = data.design.textColor || '#1f2937';

    return `
/* Estilos CSS generados para ${data.business.name} */

:root {
  --primary-color: ${primaryColor};
  --secondary-color: ${secondaryColor};
  --accent-color: ${accentColor};
  --text-color: ${textColor};
  --background-color: #ffffff;
  --light-gray: #f3f4f6;
  --dark-gray: #6b7280;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.slogan {
  font-size: 0.875rem;
  opacity: 0.9;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-menu a:hover {
  opacity: 0.8;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 8rem 0 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
}

.hero-content h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: var(--accent-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

/* Sections */
section {
  padding: 4rem 0;
}

section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--primary-color);
}

/* Menu/Services Grid */
.menu-grid,
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.menu-item,
.service-item {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
  overflow: hidden;
}

.menu-item:hover,
.service-item:hover {
  transform: translateY(-5px);
}

.menu-image,
.service-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.menu-item h3,
.service-item h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.price {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-top: 1rem;
}

.service-item i {
  font-size: 3rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

/* About Section */
.about-section {
  background-color: var(--light-gray);
  text-align: center;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.about-text {
  text-align: left;
}

.about-text h2 {
  text-align: left;
  margin-bottom: 1.5rem;
}

.about-text p {
  font-size: 1.125rem;
  line-height: 1.7;
}

.about-image {
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Contact Section */
.contact-section {
  background-color: var(--primary-color);
  color: white;
}

.contact-section h2 {
  color: white;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.contact-info h3,
.contact-form h3 {
  margin-bottom: 1.5rem;
}

.contact-item {
    display: flex;
    align-items: center;
  margin-bottom: 1rem;
  }
  
.contact-item i {
  margin-right: 1rem;
  color: var(--secondary-color);
  }
  
.contact-form form {
  display: flex;
    flex-direction: column;
  gap: 1rem;
}

.contact-form input,
.contact-form textarea {
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-family: inherit;
}

.contact-form textarea {
  resize: vertical;
}

/* Footer */
.footer {
  background-color: var(--text-color);
  color: white;
  padding: 3rem 0 1rem;
  }
  
  .footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.footer-section a:hover {
  opacity: 1;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.social-links a:hover {
  background-color: var(--accent-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .container {
    padding: 0 15px;
  }
  
  .hero-content h2 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.125rem;
  }
  
  section h2 {
    font-size: 2rem;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .about-text {
    text-align: center;
  }
  
  .about-text h2 {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .hero {
    padding: 6rem 0 3rem;
  }
  
  .hero-content h2 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  section {
    padding: 3rem 0;
  }
  
  section h2 {
    font-size: 1.75rem;
  }
  
  .menu-grid,
  .services-grid,
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .menu-item,
  .service-item {
    padding: 1.5rem;
  }
  
  .menu-image,
  .service-image {
    height: 150px;
  }
  
  .about-image {
    height: 300px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  .hero {
    padding: 5rem 0 2rem;
  }
  
  .hero-content h2 {
    font-size: 1.5rem;
  }
  
  .hero-content p {
    font-size: 0.9rem;
  }
  
  section {
    padding: 2rem 0;
  }
  
  section h2 {
    font-size: 1.5rem;
  }
  
  .menu-item,
  .service-item {
    padding: 1rem;
  }
  
  .menu-image,
  .service-image {
    height: 120px;
  }
  
  .about-image {
    height: 200px;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-item,
.service-item {
  animation: fadeInUp 0.6s ease forwards;
}

.menu-item:nth-child(2),
.service-item:nth-child(2) {
  animation-delay: 0.2s;
}

.menu-item:nth-child(3),
.service-item:nth-child(3) {
  animation-delay: 0.4s;
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles para accesibilidad */
.btn:focus,
.nav-menu a:focus,
.social-links a:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Custom CSS */
${data.advanced.customCSS || ''}
  `;
}

/**
 * Genera el JavaScript del sitio web
 */
function generateJS(data) {
      return `
// JavaScript generado para ${data.business.name}

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling para enlaces internos
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Formulario de contacto
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Aquí se procesaría el envío del formulario
      alert('Gracias por tu mensaje. Te contactaremos pronto.');
      this.reset();
    });
  }
  
  // Animaciones al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observar elementos para animaciones
  const animatedElements = document.querySelectorAll('.menu-item, .service-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
  });
  
  // Navegación activa
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
});

// Funcionalidades adicionales
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = \`notification \${type}\`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Horarios de apertura
const openingHours = ${JSON.stringify(data.advanced.openingHours || [])};

function getCurrentDay() {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[new Date().getDay()];
}

function isOpenNow() {
  const today = getCurrentDay();
  const todayHours = openingHours.find(h => h.day === today);
  
  if (!todayHours || !todayHours.open) {
    return false;
  }
  
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  
  const openTime = openHour * 100 + openMin;
  const closeTime = closeHour * 100 + closeMin;
  
  return currentTime >= openTime && currentTime <= closeTime;
}

// Mostrar estado de apertura si hay horarios
if (openingHours.length > 0) {
  const statusElement = document.createElement('div');
  statusElement.className = 'status-indicator';
  statusElement.innerHTML = \`
    <span class="status-dot \${isOpenNow() ? 'open' : 'closed'}"></span>
    <span>\${isOpenNow() ? 'Abierto' : 'Cerrado'}</span>
  \`;
  
  const header = document.querySelector('.header');
  if (header) {
    header.appendChild(statusElement);
  }
}
  `;
}

/**
 * Genera el archivo README
 */
function generateREADME(data) {
      return `
# ${data.business.name} - Sitio Web

Este sitio web fue generado automáticamente con WebCreator Pro.

## Información del Negocio

- **Nombre:** ${data.business.name}
- **Tipo:** ${data.business.type || 'No especificado'}
- **Descripción:** ${data.business.description || 'No especificada'}
- **Slogan:** ${data.business.slogan || 'No especificado'}

## Información de Contacto

- **Dirección:** ${data.contact.address || 'No especificada'}
- **Teléfono:** ${data.contact.phone || 'No especificado'}
- **Email:** ${data.contact.email || 'No especificado'}
- **WhatsApp:** ${data.contact.whatsapp || 'No especificado'}
- **Sitio Web:** ${data.contact.website || 'No especificado'}

## Redes Sociales

${Object.entries(data.social)
  .filter(([key, value]) => value)
  .map(([key, value]) => `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}`)
  .join('\n') || '- No especificadas'}

## Características del Sitio

${data.advanced.features.map(feature => `- ${feature}`).join('\n') || '- No especificadas'}

## Horarios de Apertura

${data.advanced.openingHours.map(hour => `- **${hour.day}:** ${hour.open} - ${hour.close}`).join('\n') || '- No especificados'}

## Colores del Diseño

- **Color Primario:** ${data.design.primaryColor}
- **Color Secundario:** ${data.design.secondaryColor}
- **Color de Acento:** ${data.design.accentColor}
- **Color de Texto:** ${data.design.textColor}

## Instalación

1. Descarga todos los archivos
2. Abre \`index.html\` en tu navegador
3. El sitio web estará listo para usar

## Personalización

Para personalizar el sitio web:

1. Edita el archivo \`styles.css\` para cambiar los estilos
2. Modifica \`script.js\` para agregar funcionalidades
3. Actualiza \`index.html\` para cambiar el contenido

## Soporte

Si necesitas ayuda, contacta al desarrollador o consulta la documentación de WebCreator Pro.

---
*Generado el ${new Date().toLocaleDateString('es-ES')}*
  `;
}

/**
 * Genera el sitio web completo
 */
function generateWebsite(formData) {
  console.log('Generando sitio web con datos:', formData);
  
  try {
    // Determinar la plantilla a usar
    const templateType = formData.template?.id || 'default';
    const templateFunction = templateHTMLs[templateType] || templateHTMLs.default;
    
    // Generar HTML
    const html = templateFunction(formData);
    
    // Generar CSS
    const css = generateCSS(formData);
    
    // Generar JavaScript
    const js = generateJS(formData);
    
    // Generar README
    const readme = generateREADME(formData);
    
    return {
      html,
      css,
      js,
      readme,
      templateType
    };
    
  } catch (error) {
    console.error('Error al generar sitio web:', error);
    throw error;
  }
}

/**
 * Descarga el sitio web como archivo ZIP
 */
async function downloadWebsiteAsZip(formData) {
  console.log('Iniciando descarga del sitio web...');
  
  try {
    // Verificar si JSZip está disponible
    if (typeof JSZip === 'undefined') {
      throw new Error('JSZip no está disponible. Por favor, incluye la librería JSZip.');
    }
    
    // Generar el sitio web
    const website = generateWebsite(formData);
    
    // Crear el ZIP
    const zip = new JSZip();
    
    // Agregar archivos al ZIP
    zip.file('index.html', website.html);
    zip.file('styles.css', website.css);
    zip.file('script.js', website.js);
    zip.file('README.md', website.readme);
    
    // Generar el ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Crear enlace de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(zipBlob);
    downloadLink.download = `${formData.business.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_website.zip`;
    
    // Descargar
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Limpiar URL
    URL.revokeObjectURL(downloadLink.href);
    
    console.log('Sitio web descargado exitosamente');
    return true;
    
  } catch (error) {
    console.error('Error al descargar sitio web:', error);
    throw error;
  }
}

/**
 * Actualiza la vista previa en vivo
 */
function updateLivePreview(formData) {
  console.log('Actualizando vista previa en vivo...');
  try {
    const website = generateWebsite(formData);
    const previewFrame = document.getElementById('previewFrame');
    if (!previewFrame) {
      console.error('Frame de vista previa no encontrado');
        return;
      }
    // Limpiar el contenido anterior
    previewFrame.innerHTML = '';
    // Crear el iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = '#fff';
    iframe.setAttribute('title', 'Vista previa del sitio generado');
    // Inyectar el HTML generado en el iframe
    previewFrame.appendChild(iframe);
    iframe.onload = function() {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      // Inyectar HTML, CSS y JS generados
      doc.write(website.html.replace('<link rel="stylesheet" href="styles.css">', `<style>${website.css}</style>`)
        .replace('<script src="script.js"></script>', `<script>${website.js}</script>`));
      doc.close();
    };
  } catch (error) {
    console.error('Error al actualizar vista previa:', error);
  }
}

// Exportar funciones para uso global
window.generateWebsite = generateWebsite;
window.downloadWebsiteAsZip = downloadWebsiteAsZip;
window.updateLivePreview = updateLivePreview;