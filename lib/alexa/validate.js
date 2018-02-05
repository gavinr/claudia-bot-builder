'use strict';

const url = require('url');

const logErrors = true;
const validAppIds = [
  'amzn1.ask.skill.0ce9792a-9807-4999-a32a-30e29d7920a8'
]

module.exports = function validateAlexaSignature(request) {
  const certSignatureUrl = request.headers['SignatureCertChainUrl'] || request.headers['signaturecertchainurl'],
    signature = request.headers['Signature'] || request.headers['signature'],
    timestamp = request.body.request.timestamp,
    applicationId = request.body.session.application.applicationId;


  // if (!signature || !certSignatureUrl || !timestamp || !applicationId) {
  //   if(logErrors) {
  //     console.log('Validation issue: missing SignatureCertChainUrl, Signature, applicationId, or timestamp.');
  //   }
  //   return false;
  // }

  // // Checking to make sure this request is from amazon alexa
  // // https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html#verifying-that-the-request-was-sent-by-alexa
  // const parsedCertSignatureUrl = url.parse(certSignatureUrl, true);
  // if (parsedCertSignatureUrl.protocol != 'https:' || parsedCertSignatureUrl.hostname != 's3.amazonaws.com' ||
  //   (parsedCertSignatureUrl.port > 0 && parsedCertSignatureUrl.port != 443) || parsedCertSignatureUrl.pathname.indexOf('/echo.api/') !== 0) {
  //   if(logErrors) {
  //     console.log('Validation issue: request is not HTTPS or request is not from Alexa servers.');
  //   }
  //   return false;
  // }

  const requestTimeSeconds = Date.parse(timestamp) / 1000,
    currentTime = Date.now() / 1000,
    MAX_ALLOWED_TIME = 150;

  if (currentTime > requestTimeSeconds + MAX_ALLOWED_TIME) {
    if(logErrors) {
      console.log('Validation issue: issue with timesamp.');
    }
    return false;
  }

  // check AppID:
  // https://developer.amazon.com/docs/custom-skills/handle-requests-sent-by-alexa.html#verifying-that-application-id-in-the-request-matches-your-id-other-languages
  if(validAppIds.indexOf(applicationId) === -1) {
    console.log('Validation issue: invalid app id', applicationId);
    return false;
  }


  //let normalizedCertSignatureUrl = `${parsedCertSignatureUrl.protocol}://${parsedCertSignatureUrl.host}/echo.api/echo-api-cert.pem`;
  return true;
};