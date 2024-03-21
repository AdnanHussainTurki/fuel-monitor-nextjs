export default async function getBrands() {
    const response = await fetch('/api/vehicle/brands')
    const data = await response.json()
    return data.brands
}
