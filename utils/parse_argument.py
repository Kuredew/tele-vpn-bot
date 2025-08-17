def parse_create_argument(string:str) -> dict | None:
    obj = {}

    splitted_string = string.split(" ")

    quota = 0
    limit_ip = 2
    try:
        if len(splitted_string) == 4:
            vpn_protocol = str(splitted_string[1])
            username = str(splitted_string[2])
            exp = int(splitted_string[3])
            
            obj["vpn_protocol"] = vpn_protocol
            obj["username"] = username
            obj["exp"] = exp
            obj["quota"] = quota
            obj["limit_ip"] = limit_ip
        else:
            vpn_protocol = str(splitted_string[1])
            username = str(splitted_string[2])
            password = str(splitted_string[3])
            exp = int(splitted_string[4])

            
            obj["vpn_protocol"] = vpn_protocol
            obj["username"] = username
            obj["password"] = password
            obj["exp"] = exp
            obj["quota"] = quota
            obj["limit_ip"] = limit_ip
    except:
        print("PARSER : Error parsing argument, argument not valid.")
        return None
        
    return obj

def parse_delete_argument(string:str) -> dict | None:
    obj = {}

    splitted_string = string.split(" ")

    try:
        vpn_protocol = str(splitted_string[1])
        username = str(splitted_string[2])
        
        obj["vpn_protocol"] = vpn_protocol
        obj["username"] = username
    except:
        print("PARSE : Argument not valid!")
        return None
        
    return obj

def parse_renew_argument(string:str) -> dict | None:
    obj = {}

    splitted_string = string.split(" ")

    try:
        vpn_protocol = str(splitted_string[1])
        username = str(splitted_string[2])
        exp = int(splitted_string[3])
        quota = 0
        limit_ip = 2
        
        obj["vpn_protocol"] = vpn_protocol
        obj["username"] = username
        obj["exp"] = exp
        obj["quota"] = quota
        obj["limit_ip"] = limit_ip
    except:
        print("PARSER : Error parsing argument, argument not valid.")
        return None
        
    return obj