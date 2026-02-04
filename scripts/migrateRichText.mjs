// Migration Script: Convert richText arrays to plain strings
// Uses native fetch - no dependencies required

const PROJECT_ID = '97oreljh'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const TOKEN = process.env.SANITY_API_TOKEN

if (!TOKEN) {
  console.error('ERROR: SANITY_API_TOKEN environment variable is required')
  process.exit(1)
}

const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data`

// Fetch da Sanity
async function sanityFetch(query) {
  const url = `${BASE_URL}/query/${DATASET}?query=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  })
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`)
  const data = await res.json()
  return data.result
}

// Patch documento
async function sanityPatch(docId, patch) {
  const url = `${BASE_URL}/mutate/${DATASET}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      mutations: [{
        patch: {
          id: docId,
          set: patch
        }
      }]
    })
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Patch error: ${res.status} - ${err}`)
  }
  return res.json()
}

// Estrae testo plain da un array di blocchi Portable Text
function extractPlainText(blocks) {
  if (!blocks) return ''
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return String(blocks)

  return blocks
    .filter(block => block._type === 'block')
    .map(block => {
      if (!block.children) return ''
      return block.children
        .filter(child => child._type === 'span')
        .map(span => span.text || '')
        .join('')
    })
    .join('\n')
}

// Converte un oggetto locale (it, en, es) da richText a string
function convertLocaleField(localeObj) {
  if (!localeObj) return null
  if (typeof localeObj === 'string') return null

  const converted = {}
  let hasChanges = false

  for (const lang of ['it', 'en', 'es']) {
    if (localeObj[lang] !== undefined) {
      if (Array.isArray(localeObj[lang])) {
        converted[lang] = extractPlainText(localeObj[lang])
        hasChanges = true
        const preview = converted[lang].substring(0, 50)
        console.log(`    ${lang}: "${preview}${preview.length >= 50 ? '...' : ''}"`)
      } else {
        converted[lang] = localeObj[lang]
      }
    }
  }

  return hasChanges ? converted : null
}

// Campi da controllare nelle sezioni
const fieldsToConvert = [
  'eyebrow', 'title', 'subtitle', 'description',
  'formTitle', 'formSubtitle', 'submitButtonText',
  'formSuccessMessage', 'formErrorMessage', 'privacyText',
  'contactInfoTitle', 'openingHoursTitle', 'socialTitle',
]

async function migratePages() {
  console.log('Fetching all pages...')

  const pages = await sanityFetch(`*[_type == "page"]{_id, _rev, title, sections}`)
  console.log(`Found ${pages.length} pages\n`)

  for (const page of pages) {
    console.log(`\n📄 Page: ${page.title || page._id}`)

    if (!page.sections || !Array.isArray(page.sections)) {
      console.log('  No sections found')
      continue
    }

    let hasChanges = false
    const updatedSections = page.sections.map((section, sIdx) => {
      const sectionType = section._type || 'unknown'
      let sectionChanged = false
      const updatedSection = { ...section }

      for (const field of fieldsToConvert) {
        if (section[field]) {
          const converted = convertLocaleField(section[field])
          if (converted) {
            console.log(`  📝 Section ${sIdx} (${sectionType}) - field "${field}":`)
            updatedSection[field] = converted
            sectionChanged = true
          }
        }
      }

      // Controlla anche campi nested come formFields
      if (section.formFields && Array.isArray(section.formFields)) {
        const updatedFormFields = section.formFields.map((ff, ffIdx) => {
          let ffChanged = false
          const updatedFF = { ...ff }

          for (const field of ['label', 'placeholder']) {
            if (ff[field]) {
              const converted = convertLocaleField(ff[field])
              if (converted) {
                console.log(`  📝 Section ${sIdx} formField[${ffIdx}] - "${field}":`)
                updatedFF[field] = converted
                ffChanged = true
              }
            }
          }

          return ffChanged ? updatedFF : ff
        })

        if (updatedFormFields.some((ff, i) => ff !== section.formFields[i])) {
          updatedSection.formFields = updatedFormFields
          sectionChanged = true
        }
      }

      // contactItems
      if (section.contactItems && Array.isArray(section.contactItems)) {
        const updatedItems = section.contactItems.map((item, iIdx) => {
          if (item.label) {
            const converted = convertLocaleField(item.label)
            if (converted) {
              console.log(`  📝 Section ${sIdx} contactItem[${iIdx}] - "label":`)
              return { ...item, label: converted }
            }
          }
          return item
        })

        if (updatedItems.some((item, i) => item !== section.contactItems[i])) {
          updatedSection.contactItems = updatedItems
          sectionChanged = true
        }
      }

      // openingHours
      if (section.openingHours && Array.isArray(section.openingHours)) {
        const updatedHours = section.openingHours.map((hour, hIdx) => {
          let hChanged = false
          const updatedH = { ...hour }

          for (const field of ['days', 'note']) {
            if (hour[field]) {
              const converted = convertLocaleField(hour[field])
              if (converted) {
                console.log(`  📝 Section ${sIdx} openingHours[${hIdx}] - "${field}":`)
                updatedH[field] = converted
                hChanged = true
              }
            }
          }

          return hChanged ? updatedH : hour
        })

        if (updatedHours.some((h, i) => h !== section.openingHours[i])) {
          updatedSection.openingHours = updatedHours
          sectionChanged = true
        }
      }

      if (sectionChanged) hasChanges = true
      return sectionChanged ? updatedSection : section
    })

    if (hasChanges) {
      console.log(`  💾 Saving changes...`)
      try {
        await sanityPatch(page._id, { sections: updatedSections })
        console.log(`  ✅ Page updated successfully`)
      } catch (err) {
        console.error(`  ❌ Error:`, err.message)
      }
    } else {
      console.log('  ✓ No changes needed')
    }
  }
}

// Controlla anche FAQ
async function migrateFAQs() {
  console.log('\n\n📋 Checking FAQ documents...')

  const faqs = await sanityFetch(`*[_type == "faq"]{_id, question, answer}`)
  console.log(`Found ${faqs.length} FAQs`)

  for (const faq of faqs) {
    let hasChanges = false
    const updates = {}

    if (faq.question) {
      const converted = convertLocaleField(faq.question)
      if (converted) {
        updates.question = converted
        hasChanges = true
        console.log(`\n  FAQ question converted`)
      }
    }

    if (faq.answer) {
      const converted = convertLocaleField(faq.answer)
      if (converted) {
        updates.answer = converted
        hasChanges = true
        console.log(`  FAQ answer converted`)
      }
    }

    if (hasChanges) {
      try {
        await sanityPatch(faq._id, updates)
        console.log(`  ✅ FAQ updated`)
      } catch (err) {
        console.error(`  ❌ Error:`, err.message)
      }
    }
  }
}

async function main() {
  console.log('========================================')
  console.log('  Sanity Data Migration')
  console.log('  Converting richText arrays to strings')
  console.log('========================================\n')

  await migratePages()
  await migrateFAQs()

  console.log('\n\n✅ Migration complete!')
}

main().catch(console.error)
