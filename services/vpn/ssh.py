import config
from typing import Union
from ..request import get_request

def create(argument:dict) -> Union[dict, None] :
    username = argument["username"]
    exp = argument["exp"]
    limit_ip = argument["limit_ip"]

    if not "password" in argument:
        return None
    
    password = argument["password"]


    param = f":5888/createssh?user={username}&password={password}&exp={exp}&iplimit={limit_ip}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response

def delete(argument:dict) -> Union[dict, None] :
    username = argument["username"]

    param = f":5888/deletessh?user={username}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response

def renew(argument:dict) -> Union[dict, None] :
    username = argument["username"]
    exp = argument["exp"]
    limit_ip = argument["limit_ip"]

    param = f":5888/renewssh?user={username}&exp={exp}&iplimit={limit_ip}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response