(function () {
  const STYLE_ID = "shared-bottom-nav-style";

  const navItems = [
    {
      key: "home",
      label: "Trang chủ",
      href: "/",
      iconClass: "fa-solid fa-house",
    },
    {
      key: "ticket",
      label: "Mua vé",
      href: "/buy-tickets",
      iconClass: "fa-solid fa-ticket",
    },
    {
      key: "map",
      label: "Bản đồ",
      href: "/map",
      mapOnly: true,
      iconClass: "fa-solid fa-location-dot",
    },
    {
      key: "policy",
      label: "Quy định",
      href: "/policy",
      iconClass: "fa-solid fa-circle-info",
    },
    {
      key: "user",
      label: "Tài khoản",
      href: "/user",
      iconClass: "fa-solid fa-circle-user",
    },
  ];

  const pathGroups = {
    home: ["/"],
    ticket: ["/buy-tickets", "/ticket"],
    map: ["/map", "/map-game"],
    policy: ["/policy"],
    user: ["/user"],
  };

  const hiddenPaths = new Set(["/map", "/animals"]);

  function normalizePath(pathname) {
    if (!pathname) {
      return "/";
    }

    const clean = pathname.replace(/\/+$/, "");
    return clean || "/";
  }

  function getActiveKey() {
    const currentPath = normalizePath(window.location.pathname);

    for (const [key, paths] of Object.entries(pathGroups)) {
      if (paths.includes(currentPath)) {
        return key;
      }
    }

    return "";
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.has-global-bottom-nav {
        padding-bottom: 96px;
      }

      .global-bottom-nav {
        width: 100%;
        height: 78px;
        background: #f5f5f5;
        box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.12);
        font-family: "Montserrat", sans-serif;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 100000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
      }

      .global-bottom-nav .menuItem {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .global-bottom-nav .menuItemLink {
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #24421D;
        transition: color 0.25s ease;
        gap: 5px;
      }

      .global-bottom-nav .menuItemIcon {
        font-size: 20px;
        line-height: 1;
        transform: translateY(2px);
      }

      .global-bottom-nav .menuItemContent {
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 0.1px;
        line-height: 1;
      }

      .global-bottom-nav .menuMap {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: #416D21;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateY(-6px);
        box-shadow: 0 8px 14px rgba(34, 73, 20, 0.25);
      }

      .global-bottom-nav .menuMap .menuItemLink {
        width: 100%;
        height: 100%;
      }

      .global-bottom-nav .menuMapIcon {
        font-size: 30px;
        color: #fff;
        line-height: 1;
        transform: translateY(4px);
      }

      .global-bottom-nav .menuItem.active .menuItemLink {
        color: #24421D;
        font-weight: 700;
      }

      @media (max-width: 480px) {
        .global-bottom-nav {
          padding: 0 10px;
        }

        .global-bottom-nav .menuItemContent {
          font-size: 15px;
        }

        .global-bottom-nav .menuMap {
          width: 50px;
          height: 50px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureIconFont() {
    const alreadyLoaded = document.querySelector(
      'link[data-shared-nav="fa"]',
    );
    if (alreadyLoaded) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css";
    link.setAttribute("data-shared-nav", "fa");
    document.head.appendChild(link);
  }

  function buildNavMarkup(activeKey) {
    return navItems
      .map((item) => {
        if (item.mapOnly) {
          return `
            <div class="menuMap ${activeKey === item.key ? "active" : ""}">
              <a href="${item.href}" class="menuItemLink" aria-label="Bản đồ">
                <i class="${item.iconClass} menuMapIcon" aria-hidden="true"></i>
              </a>
            </div>
          `;
        }

        return `
          <div class="menuItem ${activeKey === item.key ? "active" : ""}">
            <a href="${item.href}" class="menuItemLink">
              <i class="${item.iconClass} menuItemIcon" aria-hidden="true"></i>
              <p class="menuItemContent">${item.label}</p>
            </a>
          </div>
        `;
      })
      .join("");
  }

  function findExistingMenu() {
    const candidates = document.querySelectorAll(".menu, .global-bottom-nav");

    for (const element of candidates) {
      if (element.classList.contains("global-bottom-nav")) {
        return element;
      }

      if (element.querySelector(".menuItem, .menuMap, .menuItemLink")) {
        return element;
      }
    }

    return null;
  }

  function renderSharedNav() {
    if (!document.body) {
      return;
    }

    const currentPath = normalizePath(window.location.pathname);
    if (hiddenPaths.has(currentPath)) {
      const existingNav = document.querySelector(".global-bottom-nav");
      if (existingNav) {
        existingNav.remove();
      }
      document.body.classList.remove("has-global-bottom-nav");
      return;
    }

    ensureStyles();
    ensureIconFont();

    let nav = findExistingMenu();
    if (!nav) {
      nav = document.createElement("nav");
      document.body.appendChild(nav);
    }

    nav.classList.add("menu", "global-bottom-nav");
    nav.setAttribute("aria-label", "Thanh điều hướng");
    nav.innerHTML = buildNavMarkup(getActiveKey());

    document.body.classList.add("has-global-bottom-nav");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderSharedNav);
  } else {
    renderSharedNav();
  }
})();
