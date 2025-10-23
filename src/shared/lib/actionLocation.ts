"use server"
export default async function LocationAddress(address: string) {
  const GEOCONDING = process.env.NEXT_PUBLIC_AUTH_GOOGLE_GEOCONDING;

  const query = `${address}, Brazil`;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      query
    )}&key=${GEOCONDING}`
  );

  const data = await response.json();

  if (data.status !== "OK") {
    console.error("Status da API:", data.status);
    console.error(
      "Mensagem de erro:",
      data.error_message || "Sem mensagem de erro"
    );
    throw new Error("Failed to fetch location data");
  }

  const location = data.results[0].geometry.location;

  return {
    lat: location.lat,
    lng: location.lng,
    baseLat: -18.5637236,
    baseLng: -46.5240599,
  };
}

export async function DistanceBetweenPoints(formDistance: FormData) {
  const GEOCONDING = process.env.NEXT_PUBLIC_AUTH_GOOGLE_GEOCONDING;
  const lat = formDistance.get("lat");
  const lng = formDistance.get("lng");
  const baseLat = formDistance.get("baseLat");
  const baseLng = formDistance.get("baseLng");
  const destinoStr = `${lat},${lng}`;
  const origemStr = `${baseLat},${baseLng}`;

  try {
    const distance = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origemStr
      )}&destinations=${encodeURIComponent(
        destinoStr
      )}&mode="driving"&language=pt-BR&key=${GEOCONDING}`
    );
    const data = await distance.json();
    if (data.rows[0].elements[0].status === "OK") {
      return {
        status: "OK",
        distancia: data.rows[0].elements[0].distance,
        duracao: data.rows[0].elements[0].duration,
        origem: data.origin_addresses[0],
        destino: data.destination_addresses[0],
      };
    } else {
      return {
        status: "ROUTE_ERROR",
        mensagem: `Não foi possível calcular a rota: ${data.rows[0].elements[0].status}`,
      };
    }
  } catch (error) {
    console.error("Erro ao calcular a distância:", error);
    throw new Error("Failed to calculate distance");
  }
}
