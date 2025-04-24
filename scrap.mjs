import {chromium} from "playwright"  // o el que sea

const browser = await chromium.launch()
const page    = await browser.newPage()

// lista de páginas con enlaces a 'obras-singulares'
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
console.log(enlaces_de_obras_singulares)

for(const url of enlaces_de_obras_singulares){
	const urls =[]
	await page.goto(url)
	const locators  = page.locator('h3.header-title')
	for(const locator of await locators.all()){
		console.log(await locator.innerText())
	}
}


await browser.close();

async function Recupera_urls_de(pag) {
	const pags = []
	await page.goto(pag);
	const locators = page.locator('.descripcion > a')
	for (const locator of await locators.all()) {
	pags.push(await locator.getAttribute('href'))
	}
	return pags
}

//Sacar titulo, enlace imagen, procedencia, comentario