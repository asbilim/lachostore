const backendUrl = process.env.BACKEND_URL;

export const getProducts = async () => {
  try {
    const response = await fetch(`${backendUrl}/store/api/products/`, {
      next: { tags: ["products"], revalidate: 3600 },
    });
    if (!response.ok) {
      return { status: false, status: response.status };
    }
    const data = await response.json();
    return data;
  } catch (e) {
    return { status: false, error: e.message };
  }
};

export const getTrendingProducts = async () => {
  try {
    const response = await fetch(`${backendUrl}/store/api/trending-products/`, {
      next: { tags: ["trending-products"], revalidate: 3600 },
    });
    if (!response.ok) {
      return { status: false, status: response.status };
    }
    const data = await response.json();
    return data;
  } catch (e) {
    return { status: false, error: e.message };
  }
};

export const getRecommendedProducts = async () => {
  try {
    const response = await fetch(
      `${backendUrl}/store/api/recommended-products/`,
      {
        next: { tags: ["trending-products"], revalidate: 3600 },
      }
    );
    if (!response.ok) {
      return { status: false, status: response.status };
    }
    const data = await response.json();
    return data;
  } catch (e) {
    return { status: false, error: e.message };
  }
};

export const getCustomerChoicesProducts = async () => {
  try {
    const response = await fetch(`${backendUrl}/store/api/customer-choices/`, {
      next: { tags: ["customer-choices-products"], revalidate: 3600 },
    });
    if (!response.ok) {
      return { status: false, status: response.status };
    }
    const data = await response.json();
    return data;
  } catch (e) {
    return { status: false, error: e.message };
  }
};
