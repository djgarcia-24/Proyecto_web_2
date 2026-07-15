// ==========================================================================
// CARGADOR DINÁMICO DE COMPONENTES HTML (Módulos HTML)
// ==========================================================================

export async function loadComponents() {
  const components = [
    { selector: "#screen-auth", path: "html/auth.html" },
    { selector: ".app-header", path: "html/header.html" },
    { selector: ".app-sidebar", path: "html/sidebar.html" },
    { selector: "#view-explore", path: "html/explore.html" },
    { selector: "#view-favorites", path: "html/favorites.html" },
    { selector: ".global-player", path: "html/player.html" },
  ];

  // Detector de Protocolo Local file:// (Prevención de errores de CORS del Navegador)
  if (window.location.protocol === "file:") {
    const errorBanner = document.createElement("div");
    errorBanner.className = "cors-error-overlay";
    errorBanner.innerHTML = `
      <div class="cors-error-container">
        <i class="fa-solid fa-triangle-exclamation cors-error-icon animate-pulse"></i>
        <h2 class="cors-error-title">Error de CORS del Navegador</h2>
        <p class="cors-error-desc">
          Por políticas de seguridad de los navegadores modernos, los módulos HTML no pueden cargarse dinámicamente si abres el archivo directamente haciendo doble clic (protocolo <strong>file://</strong>).
        </p>
        <div class="cors-error-instructions">
          <strong>¿Cómo solucionarlo?</strong><br>
          1. Abre VS Code en esta carpeta.<br>
          2. Instala la extensión <strong>Live Server</strong> (si no la tienes).<br>
          3. Haz clic derecho en <code>inicio_sesion.html</code> y selecciona <strong>"Open with Live Server"</strong>.<br>
          4. O ejecuta un servidor local con Node: <code>npx serve</code> en tu consola.
        </div>
        <p class="cors-error-footer">Deezer-Manager • Proyecto Web UCAB</p>
      </div>
    `;
    document.body.appendChild(errorBanner);
    throw new Error(
      "CORS Blocked: Módulos HTML requieren un servidor local (http://).",
    );
  }

  // Carga asíncrona concurrente de todos los componentes
  const promises = components.map(async (c) => {
    const container = document.querySelector(c.selector);
    if (!container) return;

    try {
      const response = await fetch(c.path);
      if (!response.ok) {
        throw new Error(`Error HTTP: status ${response.status}`);
      }
      const htmlContent = await response.text();
      container.innerHTML = htmlContent;
    } catch (err) {
      console.error(
        `Fallo crítico cargando el componente HTML modular: ${c.path}`,
        err,
      );
      container.innerHTML = `
        <div class="component-load-error">
          <i class="fa-solid fa-circle-xmark"></i> Error de carga en componente: ${c.path}
        </div>
      `;
      throw err;
    }
  });

  await Promise.all(promises);
}
