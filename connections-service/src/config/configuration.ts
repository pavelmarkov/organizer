export default () => ({
  database: {
    schema: "neo4j",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT ?? "", 10) || 7687,
    username: "neo4j",
    password: "neo4jneo4j",
  },
});
