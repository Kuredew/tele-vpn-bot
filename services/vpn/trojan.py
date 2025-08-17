import config

from ..request import get_request

def create(argument:dict) -> dict | None :
    username = argument["username"]
    exp = argument["exp"]
    quota = argument["quota"]
    limit_ip = argument["limit_ip"]


    param = f":5888/createtrojan?user={username}&exp={exp}&quota={quota}&iplimit={limit_ip}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response

def delete(argument:dict) -> dict | None :
    username = argument["username"]

    param = f":5888/deletetrojan?user={username}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response

def renew(argument:dict) -> dict | None :
    username = argument["username"]
    exp = argument["exp"]
    quota = argument["quota"]
    limit_ip = argument["limit_ip"]

    param = f":5888/renewtrojan?user={username}&exp={exp}&quota={quota}&iplimit={limit_ip}&auth={config.AUTH}"
    url = f"http://{config.SERVER}{param}"

    response = get_request(url)

    return response