import config

def parse_create_v2ray_template(response:dict, vpn_protocol:str) -> str :
    response_data = response["data"]
    username = response_data['username']
    expired = response_data["expired"]
    uuid = response_data["uuid"]
    #quota = response_data["quota"] if response_data["quota"] != "0 GB" else "0 GB"
    ip_limit = response_data["ip_limit"]
    #domain = response_data["domain"]
    #ns_domain = response_data["ns_domain"]
    
    tls = None
    non_tls = None
    grpc = None
    if vpn_protocol == "vmess":
        tls = response_data["vmess_tls_link"]
        non_tls = response_data["vmess_nontls_link"]
        grpc = response_data["vmess_grpc_link"]
    elif vpn_protocol == "vless":
        tls = response_data["vless_tls_link"]
        non_tls = response_data["vless_nontls_link"]
        grpc = response_data["vless_grpc_link"]
    elif vpn_protocol == "trojan":
        tls = response_data["trojan_tls_link"]
        grpc = response_data["trojan_grpc_link"]

    template = None
    if vpn_protocol != "trojan":
        with open("template/v2ray_create_template.txt", 'r', encoding='utf-8') as f:
            template = f.read()
    else:
        with open("template/trojan_create_template.txt", 'r', encoding='utf-8') as f:
            template = f.read()
    
    template_parsed = template.format(
        name=username,
        password=uuid,
        provider=config.PROVIDER,
        non_tls=non_tls,
        tls=tls,
        grpc=grpc,
        expired_date=expired,
        max_device=ip_limit
    )


    return template_parsed

def parse_renew_v2ray_template(response:dict) -> str :
    response_data = response["data"]
    username = response_data['username']
    expired = response_data["exp"]
    #quota = response_data["quota"] if response_data["quota"] != "0 GB" else "0 GB"
    ip_limit = response_data["limitip"]
    #domain = response_data["domain"]
    #ns_domain = response_data["ns_domain"]

    template = None
    with open("template/v2ray_renew_template.txt", 'r', encoding='utf-8') as f:
        template = f.read()
    
    template_parsed = template.format(
        name=username,
        provider=config.PROVIDER,
        expired_date=expired,
        max_device=ip_limit
    )

    return template_parsed

def parse_create_ssh_template(response:dict) -> str :
    response_data = response["data"]
    username = response_data['username']
    password = response_data['password']
    expired = response_data["expired"]
    ip_limit = response_data["ip_limit"]

    template = None
    with open("template/ssh_create_template.txt", 'r', encoding='utf-8') as f:
        template = f.read()
    
    template_parsed = template.format(
        name=username,
        provider=config.PROVIDER,
        password=password,
        expired_date=expired,
        max_device=ip_limit
    )


    return template_parsed

def parse_renew_ssh_template(response:dict) -> str :
    response_data = response["data"]
    username = response_data['username']
    expired = response_data["exp"]
    ip_limit = response_data["limitip"]

    template = None
    with open("template/ssh_renew_template.txt", 'r', encoding='utf-8') as f:
        template = f.read()
    
    template_parsed = template.format(
        name=username,
        provider=config.PROVIDER,
        expired_date=expired,
        max_device=ip_limit
    )


    return template_parsed