import os
import sys

from babel.support import Translations
from pyramid.i18n import get_localizer
from pyramid.threadlocal import get_current_request

import cropontology.plugins as p


def add_renderer_globals(event):
    request = event.get("request")
    if request is None:
        request = get_current_request()
    event["_"] = request.translate
    event["localizer"] = request.localizer


def add_localizer(event):
    request = event.request
    localizer = get_localizer(request)
    module = sys.modules["cropontology"]
    cropontology_locale_path = os.path.join(os.path.dirname(module.__file__), "locale")
    list_of_desired_locales = [request.locale_name]
    translations = Translations.load(
        cropontology_locale_path, list_of_desired_locales, "cropontology"
    )
    for plugin in p.PluginImplementations(p.ITranslation):
        plugin_translation_directory = plugin.get_translation_directory()
        plugin_translation_domain = plugin.get_translation_domain()
        translations_plugin = Translations.load(
            plugin_translation_directory,
            list_of_desired_locales,
            plugin_translation_domain,
        )
        translations.merge(translations_plugin)

    def auto_translate(string):
        return translations.gettext(string)

    request.localizer = localizer
    request.translate = auto_translate
