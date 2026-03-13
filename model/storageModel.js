(function () {
  const KEYS = {
    cart: "cart",
    gameCart: "gameCart",
    profile: "profileData",
  };

  function getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  window.StorageModel = {
    KEYS,
    getJSON,
    setJSON,
    remove,
  };
})();
