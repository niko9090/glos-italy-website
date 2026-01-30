// Revalidation Webhook for Sanity
// This endpoint is called by Sanity when content changes
// Configure this webhook in Sanity: Settings > API > Webhooks
//
// IMPORTANT: Cache tags MUST match those used in lib/sanity/fetch.ts:
// - 'settings' for siteSettings
// - 'navigation' for navigation
// - 'pages' for all pages, 'page-{slug}' for specific pages
// - 'products' for all products, 'product-{slug}' for specific products
// - 'categories' for all categories, 'category-{slug}' for specific categories
// - 'dealers' for dealers
// - 'testimonials' for testimonials
// - 'faqs' for FAQs
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

// Type for Sanity webhook payload
interface SanityWebhookBody {
  _type: string
  _id?: string
  slug?: { current: string }
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET

    if (!secret) {
      console.error('[Revalidate] SANITY_REVALIDATE_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Parse and validate the webhook body
    const { isValidSignature, body } = await parseBody<SanityWebhookBody>(
      request,
      secret
    )

    if (!isValidSignature) {
      console.warn('[Revalidate] Invalid webhook signature received')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      console.warn('[Revalidate] Invalid webhook body - missing _type')
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    console.log(`[Revalidate] Processing ${body._type} change`, {
      id: body._id,
      slug: body.slug?.current,
    })

    // Track what was revalidated for the response
    const revalidatedPaths: string[] = []
    const revalidatedTags: string[] = []

    // Revalidate based on document type
    // Tags MUST match those in lib/sanity/fetch.ts
    switch (body._type) {
      case 'page':
        // Revalidate specific page path
        if (body.slug?.current) {
          revalidatePath(`/${body.slug.current}`)
          revalidatedPaths.push(`/${body.slug.current}`)

          // Handle localized routes
          revalidatePath(`/en/${body.slug.current}`)
          revalidatePath(`/es/${body.slug.current}`)

          // Specific page tag
          revalidateTag(`page-${body.slug.current}`)
          revalidatedTags.push(`page-${body.slug.current}`)
        }

        // Homepage special handling
        if (body.slug?.current === 'home') {
          revalidatePath('/')
          revalidatePath('/en')
          revalidatePath('/es')
          revalidatedPaths.push('/')
        }

        // All pages tag
        revalidateTag('pages')
        revalidatedTags.push('pages')
        break

      case 'product':
        // Product listing page
        revalidatePath('/prodotti')
        revalidatedPaths.push('/prodotti')

        // Specific product page
        if (body.slug?.current) {
          revalidatePath(`/prodotti/${body.slug.current}`)
          revalidatedPaths.push(`/prodotti/${body.slug.current}`)

          revalidateTag(`product-${body.slug.current}`)
          revalidatedTags.push(`product-${body.slug.current}`)
        }

        // Homepage (featured products)
        revalidatePath('/')
        revalidatedPaths.push('/')

        // All products tag
        revalidateTag('products')
        revalidatedTags.push('products')
        break

      case 'productCategory':
        // Category pages
        revalidatePath('/prodotti')
        revalidatePath('/categorie')
        revalidatedPaths.push('/prodotti', '/categorie')

        if (body.slug?.current) {
          revalidateTag(`category-${body.slug.current}`)
          revalidatedTags.push(`category-${body.slug.current}`)
        }

        // All categories tag
        revalidateTag('categories')
        // Products depend on categories
        revalidateTag('products')
        revalidatedTags.push('categories', 'products')
        break

      case 'dealer':
        revalidatePath('/rivenditori')
        revalidatedPaths.push('/rivenditori')

        revalidateTag('dealers')
        revalidatedTags.push('dealers')
        break

      case 'testimonial':
        // Homepage shows testimonials
        revalidatePath('/')
        revalidatedPaths.push('/')

        revalidateTag('testimonials')
        revalidatedTags.push('testimonials')
        break

      case 'faq':
        revalidatePath('/faq')
        revalidatedPaths.push('/faq')

        revalidateTag('faqs')
        revalidatedTags.push('faqs')
        break

      case 'siteSettings':
        // Settings affect the entire site layout
        revalidatePath('/', 'layout')
        revalidatedPaths.push('/ (layout)')

        revalidateTag('settings')
        revalidatedTags.push('settings')
        break

      case 'navigation':
        // Navigation affects the entire site layout
        revalidatePath('/', 'layout')
        revalidatedPaths.push('/ (layout)')

        revalidateTag('navigation')
        revalidatedTags.push('navigation')
        break

      default:
        // For unknown types, do a full revalidation
        console.log(
          `[Revalidate] Unknown type: ${body._type}, performing full revalidation`
        )
        revalidatePath('/', 'layout')
        revalidatedPaths.push('/ (full)')
    }

    console.log(`[Revalidate] Success:`, {
      paths: revalidatedPaths,
      tags: revalidatedTags,
    })

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      slug: body.slug?.current,
      paths: revalidatedPaths,
      tags: revalidatedTags,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Revalidate] Error processing webhook:', error)
    return NextResponse.json(
      {
        error: 'Revalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidation webhook endpoint is active',
    timestamp: new Date().toISOString(),
  })
}
