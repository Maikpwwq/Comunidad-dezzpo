const path = require('path')
import fs from 'fs'

const getManifest = () => {
    try {
        return JSON.parse(
            fs.readFileSync(path.join(__dirname, '/build/manifest.json'))
        )
    } catch (err) {
        console.error(err)
    }
}

export default getManifest