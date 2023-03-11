
const fs = require('fs').promises
const path = require('path')
const parser = require('luaparse')
const xlsx = require('xlsx')


const readAndDump = async () => {
    const file = path.join(__dirname, './auctionator_luas/new/Auctionator.lua')
    // console.log(file)
    const contentsLUA = await fs.readFile(file, { encoding: 'utf8' })
    // console.log(contentsLUA)
    // const contentsJSON = parse(contentsLUA)
    const contentsJSON = parser.parse(contentsLUA)
    // console.log(JSON.stringify(contentsJSON))
    // console.log(contentsJSON.body[3].variables[0].name)
    const databaseAST = contentsJSON.body[3].init[0].fields[1].value.fields
    let databaseForWrite = []
    for (let entry of databaseAST) {
        let newEntry = {
            name: entry.key.raw.replace(/[',"]/g, ''),
            price: entry.value.value
        }
        databaseForWrite.push(newEntry)
        continue
    }
    const sorted = databaseForWrite.sort((a, b) => a.name.localeCompare(b.name))
    // console.log(sorted)
    // console.log(databaseForWrite[700])
    const worksheet = xlsx.utils.json_to_sheet(sorted)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, "AHDatabase")
    xlsx.writeFile(workbook, "./spreadsheet/db.xlsx")
}

readAndDump()