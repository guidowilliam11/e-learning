import Students from "@/models/StudentModel"
import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import { createClient } from "@/libs/supabase/config"

export async function PATCH(req) {
  try {
    const formData = await req.formData()
    const studentId = formData.get('studentId')
    const newName = formData.get('fullName')
    const newEmail = formData.get('email')
    const picture = formData.get('picture')
    const newPassword = formData.get('newPassword')
    const oldPassword = formData.get('oldPassword')
    let newPicture = null

    let student = {}
    let studentWithEmail = null

    if (newEmail) {
      studentWithEmail = await Students.findOne({ email: newEmail })
    }
    if (!studentWithEmail) {
      student = await Students.findById(studentId)
    } else {
      student = studentWithEmail
    }
    // Email validation
    if (!student._id.equals(studentId)) {
      return NextResponse.json(
        { error: 'EMAIL_NOT_AVAILABLE' },
        { status: 400 }
      )
    }

    // Password validation
    const isPasswordValid = await bcrypt.compare(oldPassword, student.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'INVALID_PASSWORD' },
        { status: 401 }
      )
    }

    if (picture && typeof picture !== 'string') {
      const supabase = await createClient()
      const bufferBytes = await picture.arrayBuffer()
      const buffer = Buffer.from(bufferBytes)

      const pictureExtension = picture.name.split('.').pop()
      const filePath = `${crypto.randomUUID()}.${pictureExtension}`

      const { data, error } = await supabase.storage
        .from('profile')
        .upload(filePath, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: picture.type,
        })

      if (data) {
        newPicture = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
      }
      if (error) {
        newPicture = ''
        throw error
      }
    }

    student.fullName = newName
    student.email = newEmail
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      student.password = hashedPassword
    }
    if (newPicture) {
      student.picture = newPicture
    }
    await student.save()

    return NextResponse.json(student.toObject())

  } catch (error) {
    console.error('Error when updating profile: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
