export default ({ env }) => ({
  host: '0.0.0.0',
  port: env.int('PORT', 1337),
});
