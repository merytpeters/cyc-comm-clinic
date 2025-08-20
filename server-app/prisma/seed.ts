import logger from '../src/middlewares/logger.js'
import prisma from '../src/config/prisma.js'
import { faker } from '@faker-js/faker'
import {
  AppointmentPurpose,
  AppointmentStatus,
  Prisma,
  ProviderRoleTitle,
} from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, subDays } from 'date-fns'

export type PatientCreateInput = Prisma.PatientCreateInput
export type ProviderRoleCreateInput = Prisma.ProviderRoleCreateInput
export type ProviderUncheckedCreateInput = Prisma.ProviderUncheckedCreateInput
export type InsuranceProviderUncheckedCreateInput =
  Prisma.InsuranceProviderUncheckedCreateInput

// 30 Fake Patients and Cuspom Patient

const createRandomPatient = (): PatientCreateInput => ({
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password({ length: 8 }),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  phone: '081' + faker.string.numeric(8),
  date_of_birth: faker.date
    .birthdate({ min: 1950, max: 2010, mode: 'year' })
    .toISOString(),
  address: faker.location.streetAddress(),
  gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
  emergency_contact_name: faker.person.fullName(),
  emergency_contact_phone: '081' + faker.string.numeric(8),
  blood_group: faker.helpers.arrayElement([
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ]),
  allergies: faker.helpers.arrayElements(
    ['Pollen', 'Dust', 'Peanuts', 'Shellfish', 'Milk', 'Eggs', 'Latex'],
    { min: 0, max: 3 }
  ),
})

const fakePatients = faker.helpers.multiple(createRandomPatient, {
  count: 50,
})

const customPatient: PatientCreateInput = {
  email: 'testpatient@gmail.com',
  password: await bcrypt.hash('test1234', 10),
  is_verified: true,
  first_name: 'John',
  last_name: 'Doe',
  phone: '081' + faker.string.numeric(8),
  date_of_birth: '1990-07-13T14:45:00.000Z',
  address: 'No 99, West Rock street, Abeokuta, Ogun State, Nigeria',
  gender: 'MALE',
  emergency_contact_name: 'Mama Doe',
  emergency_contact_phone: '081' + faker.string.numeric(8),
  blood_group: 'A+',
  allergies: ['Chloroquine'],
  insurance_coverage: 'Basic Health Package',
  insurance_provider: {
    create: {
      name: 'Leads Insurance Coporation',
      description:
        'Providing the best in insurance package for all your health care needs. Your Number one most trusted insurance provider',
    },
  },
}

// 20 Fake Provider & a Custom Provider

// Predefined provider accounts for testing
const predefinedProviders = [
  { first_name: 'Dr. Sarah', last_name: 'Johnson', email: 'sarah.johnson@clinic.com', role_title: ProviderRoleTitle.GENERAL_PRACTIONER },
  { first_name: 'Dr. Michael', last_name: 'Chen', email: 'michael.chen@clinic.com', role_title: ProviderRoleTitle.GENERAL_PRACTIONER },
  { first_name: 'Dr. Emily', last_name: 'Rodriguez', email: 'emily.rodriguez@clinic.com', role_title: ProviderRoleTitle.PAEDIATRICIAN },
  { first_name: 'Dr. James', last_name: 'Wilson', email: 'james.wilson@clinic.com', role_title: ProviderRoleTitle.GYNAECOLOGIST },
  { first_name: 'Nurse Lisa', last_name: 'Thompson', email: 'lisa.thompson@clinic.com', role_title: ProviderRoleTitle.NURSE },
  { first_name: 'Nurse Mark', last_name: 'Davis', email: 'mark.davis@clinic.com', role_title: ProviderRoleTitle.NURSE },
  { first_name: 'Nurse Anna', last_name: 'Garcia', email: 'anna.garcia@clinic.com', role_title: ProviderRoleTitle.NURSE },
  { first_name: 'Lab Tech David', last_name: 'Brown', email: 'david.brown@clinic.com', role_title: ProviderRoleTitle.LAB_TECHNICIAN },
  { first_name: 'Lab Tech Maria', last_name: 'Lopez', email: 'maria.lopez@clinic.com', role_title: ProviderRoleTitle.LAB_TECHNICIAN },
  { first_name: 'Dr. Pharmacy', last_name: 'Williams', email: 'pharmacy.williams@clinic.com', role_title: ProviderRoleTitle.PHARMACIST },
  { first_name: 'Dr. Alex', last_name: 'Martinez', email: 'alex.martinez@clinic.com', role_title: ProviderRoleTitle.PHARMACIST },
  { first_name: 'Reception Katie', last_name: 'Miller', email: 'katie.miller@clinic.com', role_title: ProviderRoleTitle.RECEPTIONIST },
  { first_name: 'Reception Tom', last_name: 'Anderson', email: 'tom.anderson@clinic.com', role_title: ProviderRoleTitle.RECEPTIONIST },
  { first_name: 'Dr. Robert', last_name: 'Taylor', email: 'robert.taylor@clinic.com', role_title: ProviderRoleTitle.GENERAL_PRACTIONER },
  { first_name: 'Dr. Jennifer', last_name: 'White', email: 'jennifer.white@clinic.com', role_title: ProviderRoleTitle.PAEDIATRICIAN },
  { first_name: 'Dr. Christopher', last_name: 'Harris', email: 'christopher.harris@clinic.com', role_title: ProviderRoleTitle.GYNAECOLOGIST },
  { first_name: 'Nurse Patricia', last_name: 'Clark', email: 'patricia.clark@clinic.com', role_title: ProviderRoleTitle.NURSE },
  { first_name: 'Lab Tech Kevin', last_name: 'Lewis', email: 'kevin.lewis@clinic.com', role_title: ProviderRoleTitle.LAB_TECHNICIAN },
  { first_name: 'Dr. Amanda', last_name: 'Walker', email: 'amanda.walker@clinic.com', role_title: ProviderRoleTitle.PHARMACIST },
  { first_name: 'Reception Susan', last_name: 'Hall', email: 'susan.hall@clinic.com', role_title: ProviderRoleTitle.RECEPTIONIST },
]

const createProviderFromTemplate = (template: typeof predefinedProviders[0]): ProviderUncheckedCreateInput => {
  console.log(`Creating provider: ${template.first_name} ${template.last_name} (${template.email}) - Role: ${template.role_title} - Password: test1234`)
  
  return {
    email: template.email,
    password: 'test1234', // Plain password, will be hashed later
    first_name: template.first_name,
    last_name: template.last_name,
    phone: '081' + faker.string.numeric(8),
    role_title: template.role_title,
  }
}

// Create providers from predefined list
const fakeProviders = predefinedProviders.map(createProviderFromTemplate)

const customProviders: ProviderUncheckedCreateInput[] = [
  {
    email: 'testprovider@gmail.com',
    password: await bcrypt.hash('test1234', 10),
    first_name: 'Super',
    last_name: 'Admin',
    phone: '081' + faker.string.numeric(8),
    role_title: ProviderRoleTitle.ADMIN,
  },
  {
    email: 'testgeneralpractitioner@gmail.com',
    password: await bcrypt.hash('test1234', 10),
    first_name: 'Dr. Mary',
    last_name: 'Aliya',
    phone: '081' + faker.string.numeric(8),
    role_title: ProviderRoleTitle.GENERAL_PRACTIONER,
  },
  {
    email: 'testgynaecologist@gmail.com',
    password: await bcrypt.hash('test1234', 10),
    first_name: 'Dr. Tim',
    last_name: 'Peters',
    phone: '081' + faker.string.numeric(8),
    role_title: ProviderRoleTitle.GYNAECOLOGIST,
  },
  {
    email: 'testlabtechnician@gmail.com',
    password: await bcrypt.hash('test1234', 10),
    first_name: 'Dr. Lawal',
    last_name: 'King',
    phone: '081' + faker.string.numeric(8),
    role_title: ProviderRoleTitle.LAB_TECHNICIAN,
  },
  {
    email: 'testnurse@gmail.com',
    password: await bcrypt.hash('test1234', 10),
    first_name: 'Miss Sims',
    last_name: 'Martin',
    phone: '081' + faker.string.numeric(8),
    role_title: ProviderRoleTitle.NURSE,
  },
  {
    email: 'testpaediatrician@gmail.com',
    password: await bcrypt.hash('test1234', 10),
    first_name: 'Dr. Wilson',
    last_name: 'Jeffries',
    phone: '081' + faker.string.numeric(8),
    role_title: ProviderRoleTitle.PAEDIATRICIAN,
  },
  {
    email: 'testpharmacist@gmail.com',
    password: await bcrypt.hash('test1234', 10),
    first_name: 'Dr. Jade',
    last_name: 'Wilson',
    phone: '081' + faker.string.numeric(8),
    role_title: ProviderRoleTitle.PHARMACIST,
  },
  {
    email: 'testreceptionist@gmail.com',
    password: await bcrypt.hash('test1234', 10),
    first_name: 'Miss Joanna',
    last_name: 'Jones',
    phone: '081' + faker.string.numeric(8),
    role_title: ProviderRoleTitle.RECEPTIONIST,
  },
]

const providerRoles: ProviderRoleCreateInput[] = [
  {
    title: ProviderRoleTitle.ADMIN,
    description: 'Super admin with unrestricted access to every feature',
  },
  {
    title: ProviderRoleTitle.GENERAL_PRACTIONER,
    description: 'Provides primary and preventive healthcare services',
  },
  {
    title: ProviderRoleTitle.GYNAECOLOGIST,
    description: "Specializes in women's reproductive health",
  },
  {
    title: ProviderRoleTitle.LAB_TECHNICIAN,
    description: 'Conducts diagnostic tests and analyzes lab samples',
  },
  {
    title: ProviderRoleTitle.NURSE,
    description: 'Offers patient care and clinical support',
  },
  {
    title: ProviderRoleTitle.PAEDIATRICIAN,
    description: 'Treats and monitors the health of children',
  },
  {
    title: ProviderRoleTitle.PHARMACIST,
    description: 'Dispenses medications and advises on drug use',
  },
  {
    title: ProviderRoleTitle.RECEPTIONIST,
    description: 'Manages front-desk operations and patient scheduling',
  },
]

const createRandomInsuranceProvider =
  (): InsuranceProviderUncheckedCreateInput => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
  })

const fakeInsuranceProviders = faker.helpers.multiple(
  createRandomInsuranceProvider,
  { count: 10 }
)

const customPatientWithAppointments: PatientCreateInput = {
  email: 'janedoe@gmail.com',
  password: await bcrypt.hash('test1234', 10),
  is_verified: true,
  first_name: 'Jane',
  last_name: 'Doe',
  phone: '081' + faker.string.numeric(8),
  date_of_birth: '1990-07-13T14:45:00.000Z',
  address: 'No 99, West Rock street, Abeokuta, Ogun State, Nigeria',
  gender: 'FEMALE',
  emergency_contact_name: 'Mama Doe',
  emergency_contact_phone: '081' + faker.string.numeric(8),
  blood_group: 'AB+',
  allergies: ['Peanut', 'Bee Sting'],
  insurance_coverage: 'Basic Health Package',
  insurance_provider: {
    create: {
      name: 'Medicare Corps',
      description:
        'Providing the best in class insurance package for all your health care needs. Your Number one most trusted insurance provider',
    },
  },
  appointments: {
    createMany: {
      data: [
        {
          has_insurance: true,
          schedule: {
            appointment_date: addDays(new Date(), 1),
            appointment_time: '14:00',
            change_count: 0,
          },
          purposes: [AppointmentPurpose.ROUTINE_HEALTH_CHECKUP],
          status: AppointmentStatus.SUBMITTED,
        },
        {
          has_insurance: true,
          schedule: {
            appointment_date: new Date(),
            appointment_time: '12:00',
            change_count: 0,
          },
          purposes: [AppointmentPurpose.FAMILY_PLANNING],
          status: AppointmentStatus.SCHEDULED,
        },
        {
          has_insurance: true,
          schedule: {
            appointment_date: subDays(new Date(), 1),
            appointment_time: '08:00',
            change_count: 2,
          },
          purposes: [AppointmentPurpose.DENTAL_CARE],
          status: AppointmentStatus.CANCELLED,
        },
      ],
      skipDuplicates: true,
    },
  },
}

const seedPatientsOrSkip = async () => {
  const patientsCount = await prisma.patient.count()
  if (patientsCount < 50) {
    return await prisma.patient.createMany({
      data: fakePatients,
      skipDuplicates: true,
    })
  }
  logger.info(
    'Skipping patient seeding, already enough patients in the database.'
  )
}

const seedProvidersOrSkip = async () => {
  const providersCount = await prisma.provider.count()
  if (providersCount < 20) {
    // Hash passwords before creating providers
    const hashedProviders = await Promise.all(
      fakeProviders.map(async (provider) => ({
        ...provider,
        password: await bcrypt.hash(provider.password, 10)
      }))
    )
    
    return await prisma.provider.createMany({
      data: hashedProviders,
      skipDuplicates: true,
    })
  }
  logger.info(
    'Skipping provider seeding, already enough providers in the database.'
  )
}

const seedInsuranceProvidersOrSkip = async () => {
  const insuranceProvidersCount = await prisma.insuranceProvider.count()
  if (insuranceProvidersCount < 10) {
    return await prisma.insuranceProvider.createMany({
      data: fakeInsuranceProviders,
      skipDuplicates: true,
    })
  }
  logger.info(
    'Skipping insurance provider seeding, already enough insurance providers in the database.'
  )
}

const seed = async () => {
  try {
    logger.info('Seeding database tables...')

    await seedPatientsOrSkip(),
      await prisma.$transaction([
        prisma.patient.upsert({
          where: { email: customPatient.email },
          update: {}, // no update if it exists
          create: customPatient,
        }),
        prisma.patient.upsert({
          where: { email: customPatientWithAppointments.email },
          update: {}, // no update if it exists
          create: customPatientWithAppointments,
        }),
        prisma.providerRole.createMany({
          data: providerRoles,
          skipDuplicates: true,
        }),
      ])
    await seedProvidersOrSkip()
    await seedInsuranceProvidersOrSkip()
    await prisma.provider.createMany({
      data: customProviders,
      skipDuplicates: true,
    })

    logger.info('Database seeded successfully!')
    await prisma.$disconnect()
    process.exit(0)
  } catch (err) {
    console.error(err)
    logger.info('Database seeding failed.')
    await prisma.$disconnect()
    process.exit(1)
  }
}

seed()
