// Script to view user data from the database
// Run with: npx tsx scripts/view-user-data.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n📊 VoteHubPH - User Data Viewer\n')
  console.log('=' . repeat(60))

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      provider: true,
      region: true,
      city: true,
      barangay: true,
      profileCompleted: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          votes: true,
          comments: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (users.length === 0) {
    console.log('\n❌ No users found in database')
    console.log('\nTo create a user, visit: http://localhost:3000/login')
    return
  }

  console.log(`\n✅ Found ${users.length} user(s) in database:\n`)

  users.forEach((user, index) => {
    console.log(`\n👤 User #${index + 1}`)
    console.log('-'.repeat(60))
    console.log(`ID:               ${user.id}`)
    console.log(`Email:            ${user.email}`)
    console.log(`Name:             ${user.name || '(not set)'}`)
    console.log(`Provider:         ${user.provider || 'email/password'}`)
    console.log(`Location:         ${user.region || '(not set)'}`)
    if (user.city) console.log(`                  ${user.city}`)
    if (user.barangay) console.log(`                  ${user.barangay}`)
    console.log(`Profile Complete: ${user.profileCompleted ? '✅ Yes' : '❌ No'}`)
    console.log(`Created:          ${user.createdAt.toLocaleString()}`)
    console.log(`Last Login:       ${user.lastLoginAt ? user.lastLoginAt.toLocaleString() : 'Never'}`)
    console.log(`Votes:            ${user._count.votes}`)
    console.log(`Comments:         ${user._count.comments}`)
  })

  console.log('\n' + '='.repeat(60))
  console.log('\n💡 Tips:')
  console.log('  - User data is stored in PostgreSQL (Neon)')
  console.log('  - View in Prisma Studio: npx prisma studio')
  console.log('  - Database URL is in .env file')
  console.log('  - Access online at: https://console.neon.tech/')
  console.log('')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
