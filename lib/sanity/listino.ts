// Listino (prezziario) - letto dal tipo Sanity `listinoItem`, gestito dal gestionale
// (Sito > Listino). Alimenta la pagina /listino-prezzi. Fail-safe: se Sanity non
// risponde ritorna [] e la pagina usa i dati storici di fallback.
import { client } from './client'

export interface ListinoItem {
  code: string
  name: string
  description?: string
  price?: number
  family?: string
  familyId?: string
  subcategory?: string
  subcategoryId?: string
  specs?: { label: string; value: string }[]
  badge?: string
  sortOrder?: number
}

export async function getListino(): Promise<ListinoItem[]> {
  try {
    const items = await client.fetch<ListinoItem[]>(
      `*[_type == "listinoItem" && isActive != false]|order(sortOrder asc){
        code, name, description, price, family, familyId, subcategory, subcategoryId,
        specs, badge, sortOrder
      }`
    )
    return items || []
  } catch {
    return []
  }
}
