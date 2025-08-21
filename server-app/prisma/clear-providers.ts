import prisma from '../src/config/prisma.js'
import bcrypt from 'bcryptjs'
import { ProviderRoleTitle } from '@prisma/client'

// Only the custom providers you want to keep
const customProviders = [
  {
    email: 'testprovider@gmail.com',
    first_name: 'Super',
    last_name: 'Admin',
    phone: '08123456789',
    role_title: ProviderRoleTitle.ADMIN,
  },
  {
    email: 'testgeneralpractitioner@gmail.com',
    first_name: 'Dr. Mary',
    last_name: 'Aliya',
    phone: '08123456790',
    role_title: ProviderRoleTitle.GENERAL_PRACTIONER,
  },
  {
    email: 'testgynaecologist@gmail.com',
    first_name: 'Dr. Tim',
    last_name: 'Peters',
    phone: '08123456791',
    role_title: ProviderRoleTitle.GYNAECOLOGIST,
  },
  {
    email: 'testlabtechnician@gmail.com',
    first_name: 'Dr. Lawal',
    last_name: 'King',
    phone: '08123456792',
    role_title: ProviderRoleTitle.LAB_TECHNICIAN,
  },
  {
    email: 'testnurse@gmail.com',
    first_name: 'Miss Sims',
    last_name: 'Martin',
    phone: '08123456793',
    role_title: ProviderRoleTitle.NURSE,
  },
  {
    email: 'testpaediatrician@gmail.com',
    first_name: 'Dr. Wilson',
    last_name: 'Jeffries',
    phone: '08123456794',
    role_title: ProviderRoleTitle.PAEDIATRICIAN,
  },
  {
    email: 'testpharmacist@gmail.com',
    first_name: 'Dr. Jade',
    last_name: 'Wilson',
    phone: '08123456795',
    role_title: ProviderRoleTitle.PHARMACIST,
  },
  {
    email: 'testreceptionist@gmail.com',
    first_name: 'Miss Joanna',
    last_name: 'Jones',
    phone: '08123456796',
    role_title: ProviderRoleTitle.RECEPTIONIST,
  },
]

const clearAndCreateCustomProviders = async () => {
  try {
    console.log('🗑️ Clearing ALL providers...')
    
    // Delete ALL existing providers
    await prisma.provider.deleteMany({})
    
    console.log('✅ All providers cleared')
    console.log('🌱 Creating only custom providers...')
    
    // Create only custom providers with hashed passwords
    const customProvidersWithHashedPasswords = await Promise.all(
      customProviders.map(async (provider) => ({
        ...provider,
        password: await bcrypt.hash('test1234', 10),
      }))
    )
    
    await prisma.provider.createMany({
      data: customProvidersWithHashedPasswords,
      skipDuplicates: true,
    })
    
    console.log('✅ Created', customProviders.length, 'custom providers')
    
    // Verify the providers were created
    const totalProviders = await prisma.provider.count()
    console.log('📊 Total providers in database:', totalProviders)
    
    console.log('📋 Available providers (password: test1234):')
    customProviders.forEach(provider => {
      console.log(`  - ${provider.email} (${provider.first_name} ${provider.last_name} - ${provider.role_title})`)
    })
    
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error clearing and seeding providers:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

clearAndCreateCustomProviders()