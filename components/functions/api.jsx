export async function handleProductVisit(id) {
  if (id == null) return { error: "provide an id shop or product id" };
  return fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);
      const result = await fetch(
        `https://ipinfo.io/${data.ip}?token=7c7a9306367c22`
      );
      const res = await result.json();
      console.log(res);
      const { ip, region, city } = res;
      const res2 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/api/product-visits/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ip_address: ip,
            region: region,
            city: city,
            product: id,
          }),
        }
      );
      const data2 = await res2.json();
      return data2;
    })
    .catch((error) => console.log(error));
}

export async function handleStoreVisit(id) {
  if (id == null) return { error: "provide an id shop or product id" };
  return fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);
      const result = await fetch(
        `https://ipinfo.io/${data.ip}?token=7c7a9306367c22`
      );
      const res = await result.json();
      console.log(res);
      const { ip, region, city } = res;
      const res2 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/api/store-visits/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ip_address: ip,
            region: region,
            city: city,
            store: id,
          }),
        }
      );
      const data2 = await res2.json();
      return data2;
    })
    .catch((error) => console.log(error));
}
