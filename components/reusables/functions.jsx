export function getUniqueVendors(products) {
  const vendorMap = new Map();
  products.forEach((product) => {
    if (product.vendor && !vendorMap.has(product.vendor.id)) {
      vendorMap.set(product.vendor.id, product.vendor);
    }
  });
  return Array.from(vendorMap.values());
}
