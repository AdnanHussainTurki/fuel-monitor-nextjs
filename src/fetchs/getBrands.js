export default async function getBrands() {
    const response = await fetch("/api/vehicle/brands");
    const data = await response.json();
    console.log("Data", data.brands);
    return data.brands;
}