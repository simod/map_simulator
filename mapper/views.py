import json

from django.template.loader import render_to_string
from django.views.generic.base import View
from django.http import HttpResponse


class SerializeKML(View):
    def post(self, request, *args, **kwargs):
        payload = json.loads(request.body)
        the_kml = open('static/app/data/maps.kml', 'w')
        the_kml.write(render_to_string('map.kml', {'features': payload['features']['features']}))
        the_kml.close()
        return HttpResponse('ok')