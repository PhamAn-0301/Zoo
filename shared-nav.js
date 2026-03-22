(function () {
  const STYLE_ID = "shared-bottom-nav-style";

  const navItems = [
    {
      key: "home",
      label: "Trang chủ",
      href: "/",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v9a1 1 0 0 1-1 1h-5.5a1 1 0 0 1-1-1V15h-2v4.5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-9Z"/></svg>',
    },
    {
      key: "ticket",
      label: "Mua vé",
      href: "/buy-tickets",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.2a2.3 2.3 0 0 0 0 4.6v2.2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.2a2.3 2.3 0 0 0 0-4.6V8.5Zm6.4-.8v8.6m2.9-8.6v8.6m2.9-8.6v8.6"/></svg>',
    },
    {
      key: "map",
      label: "Bản đồ",
      href: "/map",
      mapOnly: true,
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s6.2-5.9 6.2-11A6.2 6.2 0 1 0 5.8 11c0 5.1 6.2 11 6.2 11Zm0-8.2a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z"/></svg>',
    },
    {
      key: "policy",
      label: "Quy định",
      href: "/policy",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Zm.9 13h-1.8v-1.8h1.8v1.8Zm0-3.8h-1.8V7.4h1.8V12Z"/></svg>',
    },
    {
      key: "user",
      label: "Tài khoản",
      href: "/user",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Zm0 2.2c-4.2 0-7.6 2.2-7.6 5v.3a.8.8 0 0 0 .8.8h13.6a.8.8 0 0 0 .8-.8v-.3c0-2.8-3.4-5-7.6-5Z"/></svg>',
    },
  ];

  const pathGroups = {
    home: ["/"],
    ticket: ["/buy-tickets", "/ticket"],
    map: ["/map", "/map-game"],
    policy: ["/policy"],
    user: ["/user"],
  };

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
        height: 82px;
        background: #fff;
        box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.16);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 100000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 18px;
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
        color: #777;
        transition: color 0.25s ease;
        gap: 4px;
      }

      .global-bottom-nav .menuItemIcon {
        width: 22px;
        height: 22px;
        fill: currentColor;
      }

      .global-bottom-nav .menuItemContent {
        font-size: 14px;
        line-height: 1;
      }

      .global-bottom-nav .menuMap {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: #416d21;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 8px 14px rgba(34, 73, 20, 0.28);
      }

      .global-bottom-nav .menuMap .menuItemLink {
        width: 100%;
        height: 100%;
      }

      .global-bottom-nav .menuMapIcon {
        width: 30px;
        height: 30px;
        fill: #fff;
      }

      .global-bottom-nav .menuItem.active .menuItemLink {
        color: #0e500a;
        font-weight: 600;
      }

      @media (max-width: 480px) {
        .global-bottom-nav {
          padding: 0 10px;
        }

        .global-bottom-nav .menuItemContent {
          font-size: 12px;
        }

        .global-bottom-nav .menuMap {
          width: 50px;
          height: 50px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildNavMarkup(activeKey) {
    return navItems
      .map((item) => {
        if (item.mapOnly) {
          return `
            <div class="menuMap ${activeKey === item.key ? "active" : ""}">
              <a href="${item.href}" class="menuItemLink" aria-label="Bản đồ">
                <span class="menuMapIcon">${item.icon}</span>
              </a>
            </div>
          `;
        }

        return `
          <div class="menuItem ${activeKey === item.key ? "active" : ""}">
            <a href="${item.href}" class="menuItemLink">
              <span class="menuItemIcon">${item.icon}</span>
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

    ensureStyles();

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
