from utils import write_read_file
from typing import Union
import requests

def get_request(url:str) -> Union[dict, None]:
    print(f"    GET {url}")
    try:
        response = requests.get(url)
    except requests.exceptions.ConnectionError as e:
        print(f"Error getting request ({e})")
        return None

    status_code = response.status_code
    header = response.headers

    print(f"    Status Code : {status_code}\n    Headers : {header}")

    if status_code != 200:
        print(f"REQUEST : Response not OK ({status_code})")
        return None

    json_data = None
    try:
        json_data = response.json()
    except requests.exceptions.JSONDecodeError:
        print("REQUEST : Json decode error, data is not json.")
        return None

    write_read_file.writeJsonFile("data.json", json_data) # type: ignore
    return json_data