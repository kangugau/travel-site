require('dotenv').config()
const neo4j = require('neo4j-driver')
const { generateAttrationsCommands } = require('./generateCommand')

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  ),
  {
    encrypted: process.env.NEO4J_ENCRYPTED ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF',
  }
)

async function seedAttraction() {
  const session = driver.session()
  try {
    const commands = generateAttrationsCommands()
    let result = await session.run(commands)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

seedAttraction()
