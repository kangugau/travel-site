export const initializeDatabase = (driver) => {
  const initCypher = `CALL apoc.schema.assert({}, {
    User: ["id"], 
    Attraction: ["id"], 
    Review: ["id"], 
    Category: ["id"], 
    Type: ["id"], 
    Tag:["id"],
    City: ["id"], 
    Photo: ["url"]}, false)`

  const executeQuery = (driver) => {
    const session = driver.session()
    return session
      .writeTransaction((tx) => tx.run(initCypher))
      .then()
      .finally(() => session.close())
  }

  executeQuery(driver).catch((error) => {
    console.error('Database initialization failed to complete\n', error.message)
  })
}
