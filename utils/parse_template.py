import config

def parse_create_v2ray_template(response:dict) -> str :
    response_data = response["data"]
    username = response_data['username']
    expired = response_data["expired"]
    uuid = response_data["uuid"]
    #quota = response_data["quota"] if response_data["quota"] != "0 GB" else "0 GB"
    ip_limit = response_data["ip_limit"]
    #domain = response_data["domain"]
    #ns_domain = response_data["ns_domain"]
    
    vmess_tls_link = response_data["vmess_tls_link"]
    vmess_nontls_link = response_data["vmess_nontls_link"]
    vmess_grpc_link = response_data["vmess_grpc_link"]

    template = None
    with open("template/v2ray_create_template.txt", 'r', encoding='utf-8') as f:
        template = f.read()
    
    template_parsed = template.format(
        name=username,
        password=uuid,
        provider=config.PROVIDER,
        non_tls=vmess_nontls_link,
        tls=vmess_tls_link,
        grpc=vmess_grpc_link,
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