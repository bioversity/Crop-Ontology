import base64
import logging

from cryptography.fernet import Fernet

log = logging.getLogger("cropontology")


def encode_data(request, data):
    key = request.registry.settings["aes.key"].encode()
    key = base64.b64encode(key)
    f = Fernet(key)
    if not isinstance(data, bytes):
        data = data.encode()
    return f.encrypt(data)


def decode_data(request, data):
    key = request.registry.settings["aes.key"].encode()
    key = base64.b64encode(key)
    f = Fernet(key)
    try:
        return f.decrypt(data)
    except Exception as e:
        log.error("Error when decrypting a password. Error: {}".format(str(e)))
        return ""


def encode_data_with_key(data, key):
    key = base64.b64encode(key)
    f = Fernet(key)
    if not isinstance(data, bytes):
        data = data.encode()
    return f.encrypt(data)
