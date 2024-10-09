const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { Client } = require('pg');

const secret_name = "secret_name";
const region = "region_name";
const dbHost = "databasehost_name";
const dbPort = 5432;

const client = new SecretsManagerClient({ region });

async function getSecret() {
  try {
    const response = await client.send(new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT",
    }));
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error;
  }
}

async function testConnection() {
  const secret = await getSecret();
  const dbClient = new Client({
    host: dbHost,
    port: dbPort,
    user: secret.username,
    password: secret.password,
    database: secret.dbname,
    ssl: { rejectUnauthorized: false }, // Adjust this if you're using SSL/TLS
  });

  try {
    await dbClient.connect();
    console.log("Connected to RDS successfully!");

    // Query to get the PostgreSQL version
    const res = await dbClient.query('SELECT version();');
    console.log("PostgreSQL version:", res.rows[0].version);

    console.log("Current time:", new Date().toISOString());
  } catch (error) {
    console.error("Error connecting to RDS:", error);
  } finally {
    await dbClient.end();
  }
}

testConnection();
