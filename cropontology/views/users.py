from cropontology.views.classes import PrivateView
from pyramid.httpexceptions import HTTPNotFound


class UsersListView(PrivateView):
    def process_view(self):
        if self.user.super != 1:
            raise HTTPNotFound
        return {}
