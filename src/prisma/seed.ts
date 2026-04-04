import {prisma} from "../lib/prisma"
import bcrypt from "bcrypt"

async function main (){
    const hashPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where : {email : "alice@gmail.com"},
        update: {},  // if already exist, do nothing
        create: {
          userName: "Admin",
          email: "admin123@gmail.com",
          password: hashPassword,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
    })

    console.log("Admin user created:", admin.email)
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error)
    process.exit(1)
  })
  .finally(async () => {
     await prisma.$disconnect()  // always disconnect prisam after seeding 
  })
