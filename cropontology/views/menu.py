from .classes import PrivateView
import json
import os
from webhelpers2.html import literal


class MenuEditorView(PrivateView):
    def process_view(self):
        if self.request.method == "GET":
            repository_path = self.request.registry.settings.get("repository.path")
            paths = ["menu.json"]
            menu_json_file = os.path.join(repository_path, *paths)
            if os.path.exists(menu_json_file):
                with open(menu_json_file) as f:
                    menu_data = json.load(f)
                    menu_data = literal(menu_data)
            else:
                menu_data = [
                    {
                        "text": "About",
                        "icon": "",
                        "href": self.request.route_url("about"),
                        "target": "_self",
                        "title": "About this site",
                    },
                    {
                        "text": "Feedback",
                        "icon": "empty",
                        "href": self.request.route_url("feedback"),
                        "target": "_self",
                        "title": "Tell us what you think",
                    },
                    {
                        "text": "Help",
                        "icon": "empty",
                        "href": self.request.route_url("help"),
                        "target": "_self",
                        "title": "Help about this site",
                    },
                    {
                        "text": "API",
                        "icon": "empty",
                        "href": self.request.route_url("api_help"),
                        "target": "_self",
                        "title": "API information",
                    },
                ]
                with open(menu_json_file, "w") as json_file:
                    json.dump(menu_data, json_file)
                menu_data = literal(menu_data)
        else:
            form_data = self.get_post_dict()
            menu_data = json.loads(form_data["menu_data"])

            repository_path = self.request.registry.settings.get("repository.path")
            paths = ["menu.json"]
            menu_json_file = os.path.join(repository_path, *paths)
            with open(menu_json_file, "w") as json_file:
                json.dump(menu_data, json_file)

            menu_data = json.dumps(menu_data)
            menu_data = literal(menu_data)

        return {"menu_data": menu_data}
