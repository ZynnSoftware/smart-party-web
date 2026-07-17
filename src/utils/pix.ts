/**
 * Generates a valid PIX payload string (BR Code / EMVCo format).
 * Note: This is a simplified generator that assumes standard keys (phone, email, CPF, random).
 * It does not support dynamic QRCodes or complex metadata, which is sufficient for simple split payments.
 */
export function generatePixPayload(key: string, amount: number, merchantName: string = 'REPARTEAI', city: string = 'Brasil'): string {
  // Format amount to 2 decimal places with dot
  const formattedAmount = amount.toFixed(2)

  // Sanitize key (remove spaces)
  const sanitizedKey = key.trim().replace(/\s/g, '')

  // PIX GUI
  const gui = 'BR.GOV.BCB.PIX'

  // Construct merchant account information (ID 26)
  // 00: GUI, 01: PIX Key
  const accountInfo = `0014${gui}01${sanitizedKey.length.toString().padStart(2, '0')}${sanitizedKey}`
  
  const payloadElements = [
    '000201', // Payload Format Indicator
    `26${accountInfo.length.toString().padStart(2, '0')}${accountInfo}`, // Merchant Account Info
    '52040000', // Merchant Category Code (0000 = uncategorized)
    '5303986', // Transaction Currency (986 = BRL)
    `54${formattedAmount.length.toString().padStart(2, '0')}${formattedAmount}`, // Transaction Amount
    '5802BR', // Country Code
    `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`, // Merchant Name
    `60${city.length.toString().padStart(2, '0')}${city}`, // Merchant City
    '62070503***', // Additional Data (TxId: ***)
    '6304' // CRC16 (To be calculated)
  ]

  const payloadWithoutCrc = payloadElements.join('')
  
  // Calculate CRC16 CCITT
  const crc = crc16(payloadWithoutCrc).toString(16).toUpperCase().padStart(4, '0')
  
  return payloadWithoutCrc + crc
}

/**
 * Calculates CRC16 CCITT for the PIX payload
 */
function crc16(str: string): number {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
    }
    crc &= 0xFFFF
  }
  return crc
}
