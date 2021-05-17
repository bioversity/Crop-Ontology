from .classes import PublicView
from pyramid.response import Response
import json


def to_json(data):
    return json.dumps(data, indent=4, default=str)


class BRAPICropHarvestView(PublicView):
    def process_view(self):
        self.returnRawViewResult = True
        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
        ]
        response = Response(headerlist=headers, status=200)
        data = {}

        # Lots of complex code

        json_data = to_json(data)
        response.text = json_data
        return response


class APIDocView(PublicView):
    def process_view(self):
        return {}
