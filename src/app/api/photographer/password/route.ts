import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Both passwords are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const photographer = await prisma.photographer.findUnique({
      where: { id: (session.user as any).id },
    })
    if (!photographer) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const valid = await bcrypt.compare(currentPassword, photographer.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.photographer.update({
      where: { id: photographer.id },
      data: { passwordHash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
