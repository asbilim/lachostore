export function keepServerAwake(url) {
  const interval = 3 * 60 * 1000; // 3 minutes converted to milliseconds

  setInterval(function () {
    fetch(url)
      .then((response) => {
        if (response.ok) {
        } else {
          console.error("Failed to reach the server:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error pinging the server:", error);
      });
  }, interval);
}
