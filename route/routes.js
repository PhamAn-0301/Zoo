(function () {
  const routes = {
    home: "/",
    ticket: "/ticket",
    shopping: "/shopping",
    user: "/user",
    mapGame: "/map-game",
    game: "/game",
    cart: "/cart",
    scanner: "/scanner",
  };

  const legacy = { ...routes };

  function goTo(routeName, opts) {
    const useLegacy = opts && opts.useLegacy;
    const targetMap = useLegacy ? legacy : routes;
    const target = targetMap[routeName];

    if (!target) {
      return false;
    }

    window.location.href = target;
    return true;
  }

  window.APP_ROUTES = routes;
  window.APP_LEGACY_ROUTES = legacy;
  window.goToRoute = goTo;
})();
