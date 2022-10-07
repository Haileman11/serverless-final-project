// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '38lxvp17c4'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-pfh0hska.us.auth0.com',            // Auth0 domain
  clientId: 'GOpgh1OnehvkAAJWTAl7G7g8G6darK2f',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
