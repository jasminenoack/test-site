import json


def decode_json_content(content):
    """
    decodes the bytes into a dict.
    """
    return json.loads(content.decode('utf-8'))
