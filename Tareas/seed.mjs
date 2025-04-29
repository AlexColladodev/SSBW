process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import https from 'https'

const prisma = new PrismaClient()
const obras = JSON.parse(readFileSync('./info_obras.json'))

const imagesDir = './public/images'
if (!existsSync(imagesDir)) mkdirSync(imagesDir, { recursive: true })

for (const obra of obras) {
    const imgUrl = obra.imagen

    const imgName = new URL(imgUrl).searchParams.get('img_id') + '.jpg'
    const imgPath = path.join(imagesDir, imgName)

    //Delay porque sino el museo me corta la conexión
    await delay(500)
    // Descargar imagen
    await descargarImagen(imgUrl, imgPath)

    await prisma.obra.create({
        data: {
            título: obra.titulo,
            imágen: `images/${imgName}`,
            descripción: obra.descripcion,
            procedencia: obra.procedencia,
            comentario: obra.comentario
        }
    })

    console.log(`✅ Insertada: ${obra.titulo}`)
}

console.log('✅ Todas las obras fueron insertadas.')
await prisma.$disconnect()

function descargarImagen(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const data = []
            res.on('data', chunk => data.push(chunk))
            res.on('end', () => {
                writeFileSync(dest, Buffer.concat(data))
                resolve()
            })
        }).on('error', reject)
    })
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
