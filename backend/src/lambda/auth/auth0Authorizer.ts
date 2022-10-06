import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify  } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-pfh0hska.us.auth0.com/.well-known/jwks.json'
const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJRT7LSUrWkFpNMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1wZmgwaHNrYS51cy5hdXRoMC5jb20wHhcNMjIwOTI5MTkzOTU4WhcN
MzYwNjA3MTkzOTU4WjAkMSIwIAYDVQQDExlkZXYtcGZoMGhza2EudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArqp9QUkTxYogJP7o
atsi6oo+82GzUv3+ZiC1Mq+/Bmr6qJ8oFkZgjOIvpcOrSAS4nPbDYEL/Uaz5uBuT
ZnYKBoy+E25KwGl5jqoTuBvHJ0aTqwA6x0oRbiunwasVcGL2z07aE2Kjah+SroLX
Oqf14mHI14ctd7452FT8upmyXtDGTLWPhqD0qkr4yUcxfbcAleGw3XR0/XIGD1qM
slHpn/N3BLt4fdG2rEMNq1cU8fa74KjkqDczllG4X3Wk6de6uFoZSeN5kC4UeVHk
WF2AsC9Q2nPgiEtw65j3HiZCVxGIs3A8gXw95XmnnVJdt7opwWtJie3+KTib33ZG
CV0ZYQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQzgrMdgZjc
9+YfIGadPLmR9TxP7TAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AFMkzByNf2vfpIJvHcHt1YmlYa1tU0adE9DtzmaXxBrYsuhOTpb3EQcelO9z4qAy
FldyXhSLR/C6ZRUDDGKbhp3G/oT0YSKSprpHnrP8iLOE219TVVrso6dGZLfX/o2R
v5K0S/n1eCjUkz/3adM7XJm3wILXjpjCbE1E1hor93GLeMN2QDdjUgpDP6zc5Smq
EVaJyBhl0wTpKknL1k0Jv8tyqEFlHlwMYRW1VdDdXbZMelt+uW4N/1NIuTtE58cx
MLt1kl7W4aQdtyPjJ0n3h8ZyQ20Cxv1L8z/cVDu69n/HP+PEdvKrsz+fSAXmJFu9
SxB6na1E5YALKUkmkHSrI7c=
-----END CERTIFICATE-----`
export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt
  
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  
  return verify(token,cert,{algorithms:['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
