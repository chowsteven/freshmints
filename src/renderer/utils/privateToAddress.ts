import { publicKeyCreate, publicKeyConvert } from 'secp256k1';
import createKeccakHash from 'keccak';
import { Buffer } from 'buffer';

const privateToPublic = (privateKey: string) => {
  // get hex of privateKey string
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');

  // return uncompressed public key buffer
  return Buffer.from(publicKeyCreate(privateKeyBuffer, false));
};

export const privateToAddress = (privateKey: string) => {
  const publicKeyBuffer = privateToPublic(privateKey);

  // convert to uncompressed
  const convertedPublicKey = Buffer.from(
    publicKeyConvert(publicKeyBuffer, false)
  ).subarray(1);

  // hash public key buffer
  const hash = createKeccakHash('keccak256')
    .update(convertedPublicKey)
    .digest();

  // convert to string
  const hashStr = hash.toString('hex');

  // get last 40 characters
  const lastFortyCharacters = hashStr.slice(-40);

  // get checksum address -- CREDITS: https://github.com/miguelmota/ethereum-checksum-address/blob/master/index.js
  let checksumAddress = '0x';
  const prefix = ''; // ???

  for (let i = 0; i < lastFortyCharacters.length; i += 1) {
    checksumAddress +=
      parseInt(
        createKeccakHash('keccak256')
          .update(prefix + lastFortyCharacters)
          .digest('hex')[i],
        16
      ) >= 8
        ? lastFortyCharacters[i].toUpperCase()
        : lastFortyCharacters[i];
  }

  return checksumAddress;
};
