import config
from typing import Union
from ..request import get_request

def create(argument:dict) -> Union[dict, None] :
    username = argument["username"]
    exp = argument["exp"]
    quota = argument["quota"]
    limit_ip = argument["limit_ip"]


    param = f":5888/createvless?user={username}&exp={exp}&quota={quota}&iplimit={limit_ip}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response

def delete(argument:dict) -> Union[dict, None] :
    username = argument["username"]

    param = f":5888/deletevless?user={username}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response

def renew(argument:dict) -> Union[dict, None] :
    username = argument["username"]
    exp = argument["exp"]
    quota = argument["quota"]
    limit_ip = argument["limit_ip"]

    param = f":5888/renewvless?user={username}&exp={exp}&quota={quota}&iplimit={limit_ip}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response