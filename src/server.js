const express = require('express')
const bodyParser = require('body-parser')
const Utils = require('./utils')
const config = require('./config')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(express.static('public'))

console.clear()

app.post('/generate', (req, res) => {
    // Inputs
    const data = req.body
    let groupId = data.groupId
    let artifactId = data.artifactId
    let description = data.description
    let discord = data.discord

    // Defaults
    if (groupId === '') groupId = config.defaults.groupId
    if (artifactId === '') artifactId = config.defaults.artifactId
    if (description === '') description = config.defaults.description
    if (discord === '') discord = config.defaults.discord

    const groupIdArr = groupId.split('.')

    // Generate skeleton
    console.log('Generating skeleton..')

    // root
    Utils.dir(`../dist`)
    Utils.dir(`../dist/${artifactId}`)
    Utils.dir(`../dist/${artifactId}/.github`)
    Utils.createPomXML(groupId, artifactId)
    Utils.createTemplateIML(artifactId)

    // git
    Utils.createReadme(artifactId, description, discord)
    Utils.createContributing(artifactId)

    // src
    Utils.dir(`../dist/${artifactId}/src`)
    Utils.dir(`../dist/${artifactId}/src/main`)
    Utils.dir(`../dist/${artifactId}/src/main/java`)
    Utils.dir(`../dist/${artifactId}/src/main/java/${groupIdArr[0]}`)
    Utils.dir(`../dist/${artifactId}/src/main/java/${groupIdArr[0]}/${groupIdArr[1]}`)
    Utils.dir(`../dist/${artifactId}/src/main/java/${groupIdArr[0]}/${groupIdArr[1]}/${groupIdArr[2]}`)
    Utils.dir(`../dist/${artifactId}/src/main/java/${groupIdArr[0]}/${groupIdArr[1]}/${groupIdArr[2]}/${artifactId.toLowerCase()}`)
    Utils.createTemplateJava(groupId, artifactId);

    // Resources
    Utils.dir(`../dist/${artifactId}/src/main/resources`)
    Utils.createPluginYML(artifactId);

    console.log('Finished generating skeleton')
})

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))