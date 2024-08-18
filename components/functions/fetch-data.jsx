export async function fetchData(url, tag) {
  try {
    const response = await fetch(url, {
      next: {
        revalidate: 120,
        tags: tag,
      },
    });
    if (!response.ok) {
      console.warn(`Warning: HTTP error! status: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Warning: Error fetching data:", error);
    return null;
  }
}
