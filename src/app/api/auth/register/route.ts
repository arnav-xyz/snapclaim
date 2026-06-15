import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password min 8 chars'),
  confirmPassword: z.string(),
  studioName: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const existing = await prisma.photographer.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    await prisma.photographer.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash,
        studioName: data.studioName?.trim() || null,
        city: data.city?.trim() || null,
        phone: data.phone?.trim() || null,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const zodErr = err as any;
      return NextResponse.json(
        { error: zodErr.errors[0].message, details: zodErr.errors },
        { status: 400 }
      )
    }
    console.error('Registration error:', err)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
