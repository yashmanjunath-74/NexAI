import os
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def generate_aes_key() -> bytes:
    """Generates a secure 256-bit (32 bytes) AES key."""
    return AESGCM.generate_key(bit_length=256)

def hash_key(key: bytes) -> str:
    """Returns SHA-256 hash of the key."""
    return hashlib.sha256(key).hexdigest()

def encrypt_payload(key: bytes, plaintext: bytes) -> bytes:
    """
    Encrypts the plaintext using AES-256-GCM.
    Returns: nonce (12 bytes) + ciphertext + authentication tag.
    """
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    return nonce + ciphertext

def decrypt_payload(key: bytes, encrypted_payload: bytes) -> bytes:
    """
    Decrypts the payload using AES-256-GCM.
    Expects payload format: nonce (12 bytes) + ciphertext + tag.
    """
    if len(encrypted_payload) < 12:
        raise ValueError("Payload too short.")
    nonce = encrypted_payload[:12]
    ciphertext = encrypted_payload[12:]
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, None)

# --- Backend Master Key Simulation ---
# In production, this would be an HSM or environment variable.
MASTER_KEY_HEX = os.environ.get("MASTER_VAULT_KEY", "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")
MASTER_KEY = bytes.fromhex(MASTER_KEY_HEX)

def encrypt_aes_key(key_to_encrypt: bytes) -> bytes:
    """Encrypts the paper-specific AES key with the Master Key."""
    return encrypt_payload(MASTER_KEY, key_to_encrypt)

def decrypt_aes_key(encrypted_key: bytes) -> bytes:
    """Decrypts the paper-specific AES key using the Master Key."""
    return decrypt_payload(MASTER_KEY, encrypted_key)
