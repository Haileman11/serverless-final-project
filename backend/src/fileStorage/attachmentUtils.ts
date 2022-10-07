import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
    signatureVersion: 'v4' // Use Sigv4 algorithm
})
const ATTACHMENT_S3_BUCKET=process.env.ATTACHMENT_S3_BUCKET
const SIGNED_URL_EXPIRATION = Number.parseInt( process.env.SIGNED_URL_EXPIRATION)
export const createAttachmentPresignedUrl = (id:string) => {   
    const presignedUrl = s3.getSignedUrl('putObject', { // The URL will allow to perform the PUT operation
        Bucket: ATTACHMENT_S3_BUCKET, // Name of an S3 bucket
        Key: id, // id of an object this URL allows access to
        Expires: SIGNED_URL_EXPIRATION  // A URL is only valid for 5 minutes
    })
    return presignedUrl
}
export const getAttachmentUrl=(imageId: string) =>{
    return s3.getSignedUrl('getObject', {
      Bucket: ATTACHMENT_S3_BUCKET,
      Key: imageId,
      Expires: 400000
    })
  }
  