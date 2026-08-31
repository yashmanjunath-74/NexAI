import urllib.request
import json
import re

url = "http://localhost:8001/api/v1/auth/login/"
data = json.dumps({
    "email": "coe@nexai.com",
    "password": "password123"
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.getcode())
        print("Response:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
except Exception as e:
    print("Error:", e)
