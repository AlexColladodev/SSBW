import { chromium } from "playwright"
import fs from 'fs'

const browser = await chromium.launch()
const page = await browser.newPage()

// Las 6 páginas con Obras Singulares
const obras_singulares = [
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=2",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=3",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=4",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=5",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=6"
]

const enlaces_de_obras_singulares = []
const lista_info_para_BD = []

for (const pag of obras_singulares) {
    const urls = await Recupera_urls_de(pag)
    enlaces_de_obras_singulares.push(...urls)  // ... operador spread ES6
}

console.log("🚀 Hay ", enlaces_de_obras_singulares.length, ' páginas con obras singulares')

for (const url of enlaces_de_obras_singulares) {
    const info = await Recupera_info_de(url)
    if (info) lista_info_para_BD.push(info)
}

Guarda_en_disco("info_obras.json", lista_info_para_BD)

await browser.close();

async function Recupera_urls_de(pag) {
    await page.goto(pag)
    const locators = page.locator(".descripcion > a")
    const pags = []
    for (const locator of await locators.all()) {
        const href = await locator.getAttribute("href")
        if (href) {
            const fullUrl = new URL(href, pag).href
            pags.push(fullUrl)
        }
    }
    return pags
}

async function Recupera_info_de(url) {
    try {
        await page.goto(url)

        const titulo = await page.locator("h3.header-title").textContent()

        const imgLocator = page.locator(".detalle img")
        const imgSrc = await imgLocator.first().getAttribute("src")
        const imagen = imgSrc ? new URL(imgSrc, url).href : null

        const descripcionRaw = await page.locator(".detalle .body-content").first().allTextContents()
        const descripcion = descripcionRaw.join("\n").trim()

        const procedencia = await page.locator("h4:has-text('Procedencia') + .body-content").textContent()
        const comentario = await page.locator("h4:has-text('Comentario') + .body-content").textContent()

        return {
            titulo: titulo?.trim(),
            imagen,
            descripcion,
            procedencia: procedencia?.trim(),
            comentario: comentario?.trim()
        }
    } catch (e) {
        console.error(`❌ Error con ${url}:`, e.message)
        return null
    }
}

function Guarda_en_disco(nombre, datos) {
    fs.writeFileSync(nombre, JSON.stringify(datos, null, 2))
    console.log(`💾 Guardado en ${nombre}`)
}