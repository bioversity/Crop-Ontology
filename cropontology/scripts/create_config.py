import argparse
import os
import random
import string

from jinja2 import Environment, FileSystemLoader


def random_password(size):
    """Generate a random password """
    random_source = string.ascii_letters + string.digits + string.punctuation
    password = random.choice(string.ascii_lowercase)
    password += random.choice(string.ascii_uppercase)
    password += random.choice(string.digits)
    password += random.choice(string.punctuation)
    for i in range(size):
        password += random.choice(random_source)
    password_list = list(password)
    random.SystemRandom().shuffle(password_list)
    password = "".join(password_list)
    return password


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("ini_path", help="Path to ini file to create")
    parser.add_argument(
        "--mysql_host",
        default="localhost",
        help="MySQL host server to use. Default to localhost",
    )
    parser.add_argument(
        "--mysql_port", default=3306, help="MySQL port to use. Default to 3306"
    )
    parser.add_argument(
        "--mysql_schema",
        default="cropontology",
        help="MySQL schema to use. Default to 'cropontology'",
    )
    parser.add_argument(
        "--mysql_user_name",
        required=True,
        help="MySQL user name to use to create the schema",
    )
    parser.add_argument(
        "--mysql_user_password", required=True, help="MySQL user name password"
    )
    args = parser.parse_args()
    cropontology_path = "."
    if not os.path.exists(os.path.join(cropontology_path, "templates")):
        print("You need to execute this in the directory cropontology")
        exit(1)
    main_secret = random_password(13).replace("%", "~")
    redis_sessions_secret = random_password(13).replace("%", "~")
    auth_secret = random_password(13).replace("%", "#")
    aes_key = random_password(28).replace("%", "#")

    template_environment = Environment(
        autoescape=False,
        loader=FileSystemLoader(os.path.join(cropontology_path, "templates")),
        trim_blocks=False,
    )

    context = {
        "mysql_host": args.mysql_host,
        "mysql_port": args.mysql_port,
        "mysql_schema": args.mysql_schema,
        "mysql_user_name": args.mysql_user_name,
        "mysql_user_password": args.mysql_user_password,
        "main_secret": main_secret,
        "auth_secret": auth_secret,
        "aes_key": aes_key,
        "redis_sessions_secret": redis_sessions_secret,
    }
    rendered_template = template_environment.get_template("config.template").render(
        context
    )
    ini_path = os.path.abspath(args.ini_path)
    alembic_context = {
        "mysql_host": args.mysql_host,
        "mysql_port": args.mysql_port,
        "mysql_schema": args.mysql_schema,
        "mysql_user_name": args.mysql_user_name,
        "mysql_user_password": args.mysql_user_password,
        "config_path": ini_path,
    }
    rendered_alembic = template_environment.get_template("alembic.template").render(
        alembic_context
    )
    alembic_file = os.path.dirname(ini_path) + "/alembic.ini"
    print(alembic_file)
    if not os.path.exists(args.ini_path):
        with open(args.ini_path, "w") as f:
            f.write(rendered_template)
        with open(alembic_file, "w") as f:
            f.write(rendered_alembic)
        print("cropontology INI file created at {}".format(args.ini_path))
    else:
        print("INI file {} already exists".format(args.ini_path))
