// Revalidation Webhook for Sanity
// This endpoint is called by Sanity when content changes
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = process.env.SANITY_REVALIDATE_SECRET

    if (!secret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(request, secret)

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    if (!body?._type) {
      return NextResponse.json(
        { error: 'Invalid body' },
        { status: 400 }
      )
    }

    // Revalidate based on document type
    switch (body._type) {
      case 'page':
        if (body.slug?.current) {
          revalidatePath(`/${body.slug.current}`)
          revalidatePath(`/en/${body.slug.current}`)
          revalidatePath(`/es/${body.slug.current}`)
        }
        if (body.slug?.current === 'home') {
          revalidatePath('/')
          revalidatePath('/en')
          revalidatePath('/es')
        }
        break

      case 'product':
        revalidatePath('/prodotti')
        if (body.slug?.current) {
          revalidatePath(`/prodotti/${body.slug.current}`)
        }
        // Also revalidate homepage (featured products)
        revalidatePath('/')
        break

      case 'productCategory':
        revalidatePath('/prodotti')
        revalidatePath('/categorie')
        break

      case 'dealer':
        revalidatePath('/rivenditori')
        break

      case 'testimonial':
        revalidatePath('/')
        break

      case 'faq':
        revalidatePath('/faq')
        break

      case 'siteSettings':
      case 'navigation':
        // Revalidate everything for global settings changes
        revalidatePath('/', 'layout')
        break

      default:
        // Revalidate homepage for any other changes
        revalidatePath('/')
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      slug: body.slug?.current,
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}
