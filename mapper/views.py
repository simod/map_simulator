import json
import os

from django.template.loader import render_to_string
from django.views.generic.base import View
from django.http import HttpResponse
from django.conf import settings


class SerializeKML(View):
    def post(self, request, *args, **kwargs):
        payload = json.loads(request.body)
        the_kml = open(os.path.join(settings.BASE_DIR, settings.STATIC_ROOT, 'kml', 'map.kml'), 'w')
        the_kml.write(render_to_string('map.kml', {'features': payload['features']['features']}))
        the_kml.close()
        return HttpResponse('ok')


class DeserializeKML(View):
    def post(self, request, *args, **kwargs):
        import ipdb; ipdb.set_trace()
        pass