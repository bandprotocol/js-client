declare module 'libsodium-wrappers-sumo' {
  // We can set this here in case it should ever be changed or perhaps be a union
  type DefaultBinary = Uint8Array
  // String constant of DefaultBinary
  type Uint8ArrayFormat = 'uint8array'
  type OutputFormat = Uint8ArrayFormat | 'text' | 'hex' | 'base64'
  type StringOutputFormat = 'text' | 'hex' | 'base64'

  export interface IStringKeyPair {
    keyType: string
    privateKey: string
    publicKey: string
  }
  export interface IKeyPair {
    keyType: string
    privateKey: Uint8Array
    publicKey: Uint8Array
  }

  const ready: Promise<any>

  const SODIUM_LIBRARY_VERSION_MAJOR: any
  const SODIUM_LIBRARY_VERSION_MINOR: any
  const crypto_aead_chacha20poly1305_ABYTES: number
  const crypto_aead_chacha20poly1305_KEYBYTES: number
  const crypto_aead_chacha20poly1305_NPUBBYTES: number
  const crypto_aead_chacha20poly1305_NSECBYTES: any
  const crypto_aead_chacha20poly1305_ietf_ABYTES: any
  const crypto_aead_chacha20poly1305_ietf_KEYBYTES: any
  const crypto_aead_chacha20poly1305_ietf_NPUBBYTES: any
  const crypto_aead_chacha20poly1305_ietf_NSECBYTES: any
  const crypto_auth_BYTES: any
  const crypto_auth_KEYBYTES: any
  const crypto_auth_hmacsha256_BYTES: any
  const crypto_auth_hmacsha256_KEYBYTES: any
  const crypto_auth_hmacsha512_BYTES: any
  const crypto_auth_hmacsha512_KEYBYTES: any
  const crypto_box_BEFORENMBYTES: any
  const crypto_box_MACBYTES: any
  const crypto_box_NONCEBYTES: number
  const crypto_box_PUBLICKEYBYTES: number
  const crypto_box_SEALBYTES: number
  const crypto_box_SECRETKEYBYTES: number
  const crypto_box_SEEDBYTES: number
  const crypto_generichash_BYTES: any
  const crypto_generichash_BYTES_MAX: any
  const crypto_generichash_BYTES_MIN: any
  const crypto_generichash_KEYBYTES: any
  const crypto_generichash_KEYBYTES_MAX: any
  const crypto_generichash_KEYBYTES_MIN: any
  const crypto_hash_BYTES: any
  const crypto_onetimeauth_BYTES: number
  const crypto_onetimeauth_KEYBYTES: number
  const crypto_pwhash_ALG_ARGON2I13: any
  const crypto_pwhash_ALG_DEFAULT: number
  const crypto_pwhash_MEMLIMIT_INTERACTIVE: number
  const crypto_pwhash_MEMLIMIT_MODERATE: any
  const crypto_pwhash_MEMLIMIT_SENSITIVE: any
  const crypto_pwhash_OPSLIMIT_INTERACTIVE: number
  const crypto_pwhash_OPSLIMIT_MODERATE: any
  const crypto_pwhash_OPSLIMIT_SENSITIVE: any
  const crypto_pwhash_SALTBYTES: number
  const crypto_pwhash_STRBYTES: any
  const crypto_pwhash_STR_VERIFY: any
  const crypto_pwhash_scryptsalsa208sha256_MEMLIMIT_INTERACTIVE: number
  const crypto_pwhash_scryptsalsa208sha256_MEMLIMIT_SENSITIVE: any
  const crypto_pwhash_scryptsalsa208sha256_OPSLIMIT_INTERACTIVE: number
  const crypto_pwhash_scryptsalsa208sha256_OPSLIMIT_SENSITIVE: number
  const crypto_pwhash_scryptsalsa208sha256_SALTBYTES: number
  const crypto_pwhash_scryptsalsa208sha256_STRBYTES: any
  const crypto_pwhash_scryptsalsa208sha256_STR_VERIFY: any
  const crypto_scalarmult_BYTES: number
  const crypto_scalarmult_SCALARBYTES: number
  const crypto_secretbox_KEYBYTES: number
  const crypto_secretbox_MACBYTES: any
  const crypto_secretbox_NONCEBYTES: any
  const crypto_shorthash_BYTES: any
  const crypto_shorthash_KEYBYTES: any
  const crypto_sign_BYTES: any
  const crypto_sign_PUBLICKEYBYTES: any
  const crypto_sign_SECRETKEYBYTES: any
  const crypto_sign_SEEDBYTES: any
  const crypto_stream_chacha20_KEYBYTES: any
  const crypto_stream_chacha20_NONCEBYTES: any
  const base64_variants: any

  function symbols(): string[]
  function increment(bytes: any): void
  function add(a: any, b: any): void
  function is_zero(bytes: any): boolean
  function memzero(bytes: Uint8Array): void
  function memcmp(b1: Uint8Array, b2: Uint8Array): boolean
  function compare(b1: any, b2: any): number
  function from_string(str: string): Uint8Array
  function to_string(bytes: Uint8Array): string
  function from_hex(str: string): Uint8Array
  function to_hex(bytes: Uint8Array): string
  function is_hex(str: any): boolean
  function from_base64(sBase64: string, nBlocksSize?: any): DefaultBinary
  function to_base64(aBytes: Uint8Array, noNewLine?: any): string
  function output_formats(): string[]
  function _format_output(output: any, optionalOutputFormat?: any): any
  function _is_output_format(format: any): boolean
  function _check_output_format(format: any): void
  function AllocatedBuf(length: any): void
  function _to_allocated_buf_address(bytes: any): any
  function _malloc(length: any): any
  function _free(address: any): void
  function _free_all(addresses: any): void
  function _free_and_throw_error(address_pool: any, err: any): void
  function _free_and_throw_type_error(address_pool: any, err: any): void
  function _require_defined(
    address_pool: any,
    varValue: any,
    varName: any
  ): void
  function _any_to_Uint8Array(
    address_pool: any,
    varValue: any,
    varName: any
  ): any
  function crypto_aead_chacha20poly1305_decrypt(
    secret_nonce: Uint8Array | undefined,
    ciphertext: Uint8Array,
    additional_data: Uint8Array | undefined,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: any
  ): Uint8Array
  function crypto_aead_chacha20poly1305_decrypt_detached(
    secret_nonce: any,
    ciphertext: any,
    mac: any,
    additional_data: any,
    public_nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_aead_chacha20poly1305_encrypt(
    message: Uint8Array,
    additional_data: Uint8Array | undefined,
    secret_nonce: Uint8Array | undefined,
    public_nonce: Uint8Array,
    key: Uint8Array,
    outputFormat?: any
  ): any
  function crypto_aead_chacha20poly1305_encrypt_detached(
    message: any,
    additional_data: any,
    secret_nonce: any,
    public_nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_aead_chacha20poly1305_ietf_decrypt(
    secret_nonce: any,
    ciphertext: any,
    additional_data: any,
    public_nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_aead_chacha20poly1305_ietf_decrypt_detached(
    secret_nonce: any,
    ciphertext: any,
    mac: any,
    additional_data: any,
    public_nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_aead_chacha20poly1305_ietf_encrypt(
    message: any,
    additional_data: any,
    secret_nonce: any,
    public_nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_aead_chacha20poly1305_ietf_encrypt_detached(
    message: any,
    additional_data: any,
    secret_nonce: any,
    public_nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_auth(message: any, key: any, outputFormat?: any): any
  function crypto_auth_hmacsha256(
    message: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_auth_hmacsha256_verify(
    tag: any,
    message: any,
    key: any
  ): boolean
  function crypto_auth_hmacsha512(
    message: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_auth_hmacsha512_verify(
    tag: any,
    message: any,
    key: any
  ): boolean
  function crypto_auth_verify(tag: any, message: any, key: any): boolean
  function crypto_box_beforenm(
    publicKey: any,
    secretKey: any,
    outputFormat?: any
  ): any
  function crypto_box_detached(
    message: any,
    nonce: any,
    publicKey: any,
    secretKey: any,
    outputFormat?: any
  ): any
  function crypto_box_easy(
    message: any,
    nonce: any,
    publicKey: DefaultBinary,
    secretKey: DefaultBinary,
    outputFormat?: OutputFormat
  ): any
  function crypto_box_easy_afternm(
    message: any,
    nonce: any,
    sharedKey: any,
    outputFormat?: any
  ): any
  function crypto_box_keypair(outputFormat?: StringOutputFormat): IStringKeyPair
  function crypto_box_keypair(outputFormat?: Uint8ArrayFormat): IKeyPair
  function crypto_box_open_detached(
    ciphertext: any,
    mac: any,
    nonce: any,
    publicKey: any,
    secretKey: any,
    outputFormat?: any
  ): any
  function crypto_box_open_easy(
    ciphertext: any,
    nonce: DefaultBinary,
    publicKey: DefaultBinary,
    secretKey: DefaultBinary,
    outputFormat?: OutputFormat
  ): any
  function crypto_box_open_easy_afternm(
    ciphertext: any,
    nonce: any,
    sharedKey: any,
    outputFormat?: any
  ): any
  function crypto_box_seal(
    message: any,
    publicKey: DefaultBinary,
    outputFormat?: StringOutputFormat
  ): string
  function crypto_box_seal(
    message: any,
    publicKey: DefaultBinary,
    outputFormat?: DefaultBinary
  ): DefaultBinary
  function crypto_box_seal_open(
    ciphertext: Uint8Array,
    publicKey: DefaultBinary,
    secretKey: DefaultBinary,
    outputFormat?: StringOutputFormat
  ): string
  function crypto_box_seal_open(
    ciphertext: any,
    publicKey: DefaultBinary,
    secretKey: DefaultBinary,
    outputFormat?: DefaultBinary
  ): DefaultBinary
  function crypto_box_seed_keypair(seed: any, outputFormat?: any): any
  function crypto_generichash(
    hash_length: number,
    message: Uint8Array,
    key?: Uint8Array,
    outputFormat?: any
  ): any
  function crypto_generichash_final(
    state_address: any,
    hash_length: any,
    outputFormat?: any
  ): any
  function crypto_generichash_init(
    key: any,
    hash_length: any,
    outputFormat?: any
  ): any
  function crypto_generichash_update(
    state_address: any,
    message_chunk: any,
    outputFormat?: any
  ): void
  function crypto_hash(message: any, outputFormat?: any): any
  function crypto_hash_sha256(message: any, outputFormat?: any): any
  function crypto_hash_sha512(message: any, outputFormat?: any): any
  function crypto_onetimeauth(
    message: Uint8Array,
    key: Uint8Array,
    outputFormat?: any
  ): any
  function crypto_onetimeauth_final(state_address: any, outputFormat?: any): any
  function crypto_onetimeauth_init(key: any, outputFormat?: any): any
  function crypto_onetimeauth_update(
    state_address: any,
    message_chunk: any,
    outputFormat?: any
  ): void
  function crypto_onetimeauth_verify(
    hash: Uint8Array,
    message: Uint8Array,
    key: Uint8Array
  ): boolean
  function crypto_pwhash(
    keyLength: number,
    password: string,
    salt: DefaultBinary,
    opsLimit: number,
    memLimit: number,
    algorithm: number,
    outputFormat?: Uint8ArrayFormat
  ): DefaultBinary
  function crypto_pwhash(
    keyLength: number,
    password: string,
    salt: DefaultBinary,
    opsLimit: number,
    memLimit: number,
    algorithm: number,
    outputFormat?: StringOutputFormat
  ): string
  function crypto_pwhash_scryptsalsa208sha256(
    keyLength: number,
    password: Uint8Array,
    salt: Uint8Array,
    opsLimit: number,
    memLimit: number,
    outputFormat?: any
  ): any
  function crypto_pwhash_scryptsalsa208sha256_ll(
    password: any,
    salt: any,
    opsLimit: any,
    r: any,
    p: any,
    keyLength: any,
    outputFormat?: any
  ): any
  function crypto_pwhash_scryptsalsa208sha256_str(
    password: any,
    opsLimit: any,
    memLimit: any,
    outputFormat?: any
  ): any
  function crypto_pwhash_scryptsalsa208sha256_str_verify(
    hashed_password: any,
    password: any,
    outputFormat?: any
  ): boolean
  function crypto_pwhash_str(
    password: any,
    opsLimit: any,
    memLimit: any,
    outputFormat?: any
  ): any
  function crypto_pwhash_str_verify(
    hashed_password: any,
    password: any,
    outputFormat?: any
  ): boolean
  function crypto_scalarmult(
    privateKey: Uint8Array,
    publicKey: Uint8Array,
    outputFormat?: any
  ): any
  function crypto_scalarmult_base(
    privateKey: Uint8Array,
    outputFormat?: any
  ): any
  function crypto_secretbox_detached(
    message: any,
    nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_secretbox_easy(
    message: DefaultBinary,
    nonce: DefaultBinary,
    key: DefaultBinary,
    outputFormat?: OutputFormat
  ): any
  function crypto_secretbox_open_detached(
    ciphertext: any,
    mac: any,
    nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_secretbox_open_easy(
    ciphertext: any,
    nonce: any,
    key: any,
    outputFormat?: StringOutputFormat
  ): string
  function crypto_secretbox_open_easy(
    ciphertext: any,
    nonce: any,
    key: any,
    outputFormat?: Uint8ArrayFormat
  ): DefaultBinary
  function crypto_shorthash(message: any, key: any, outputFormat?: any): any
  function crypto_sign(message: any, privateKey: any, outputFormat?: any): any
  function crypto_sign_detached(
    message: any,
    privateKey: any,
    outputFormat?: any
  ): any
  function crypto_sign_ed25519_pk_to_curve25519(
    edPk: any,
    outputFormat?: any
  ): any
  function crypto_sign_ed25519_sk_to_curve25519(
    edSk: any,
    outputFormat?: any
  ): any
  function crypto_sign_ed25519_sk_to_pk(
    privateKey: any,
    outputFormat?: any
  ): any
  function crypto_sign_ed25519_sk_to_seed(
    privateKey: any,
    outputFormat?: any
  ): any
  function crypto_sign_keypair(outputFormat?: any): any
  function crypto_sign_open(
    signedMessage: any,
    publicKey: any,
    outputFormat?: any
  ): any
  function crypto_sign_seed_keypair(seed: any, outputFormat?: any): any
  function crypto_sign_verify_detached(
    signature: any,
    message: any,
    publicKey: any
  ): boolean
  function crypto_stream_chacha20_xor(
    input_message: any,
    nonce: any,
    key: any,
    outputFormat?: any
  ): any
  function crypto_stream_chacha20_xor_ic(
    input_message: any,
    nonce: any,
    nonce_increment: any,
    key: any,
    outputFormat?: any
  ): any
  function randombytes_buf(length: number, outputFormat?: any): any
  function randombytes_close(outputFormat?: any): void
  function randombytes_random(outputFormat?: any): number
  function randombytes_set_implementation(
    implementation: any,
    outputFormat?: any
  ): void
  function randombytes_stir(outputFormat?: any): void
  function randombytes_uniform(upper_bound: any, outputFormat?: any): number
  function sodium_version_string(): any
}
