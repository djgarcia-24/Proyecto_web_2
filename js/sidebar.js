(() => {
    const aside = document.getElementById('main-sidebar');
    if (!aside) return; 


    aside.innerHTML = `
        <div class="brand-logo">
            <span class="logo-icon" aria-hidden="true"></span>
            <span class="logo-text">Deezer-Manager</span>
        </div>
        <nav class="main-nav" aria-label="Navegación Principal">
            <ul class="nav-links">
                <li>
                    <a href="favoritos.html" class="">
                        <span class="nav-icon" aria-hidden="true">❤️</span><span class="nav-text">Favoritos</span>
                    </a>

                </li>
                <li>
                    <a href="buscador.html" class="">
                        <span class="nav-icon" aria-hidden="true">🔍 </span><span class="nav-text">Buscar</span>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="sidebar-footer">
            <button type="button" id="toggle-theme-btn" class="btn-outline">
                <span id="theme-icon" aria-hidden="true">🌓</span> <span id="theme-text">Modo Oscuro</span>
            </button>
            <button type="button" id="logout-btn" class="btn-outline btn-logout">Cerrar Sesión</button>
        </div>
    `;
})();