import os
import hashlib
from django.conf import settings

# Simulated IPFS local storage directory
IPFS_LOCAL_DIR = os.path.join(settings.BASE_DIR, "ipfs_mock_storage")

if not os.path.exists(IPFS_LOCAL_DIR):
    os.makedirs(IPFS_LOCAL_DIR, exist_ok=True)

def _generate_cid(file_bytes: bytes) -> str:
    """Generates a deterministic CID-like hash (SHA-256 for simulation)."""
    return "Qm" + hashlib.sha256(file_bytes).hexdigest()

def upload_to_ipfs(file_bytes: bytes) -> str:
    """
    Simulates uploading a file to an IPFS node.
    Returns the Content Identifier (CID).
    """
    cid = _generate_cid(file_bytes)
    file_path = os.path.join(IPFS_LOCAL_DIR, cid)
    
    with open(file_path, "wb") as f:
        f.write(file_bytes)
        
    return cid

def fetch_from_ipfs(cid: str) -> bytes:
    """
    Simulates fetching a file from an IPFS node using its CID.
    """
    file_path = os.path.join(IPFS_LOCAL_DIR, cid)
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"IPFS CID not found: {cid}")
        
    with open(file_path, "rb") as f:
        return f.read()
