from django.conf.urls import patterns, include, url

from django.views.generic import TemplateView

from .views import SerializeKML, DeserializeKML

# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:

    #url(r'^admin/', include(admin.site.urls)),
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^maps/to-kml?$', SerializeKML.as_view()),
    url(r'^maps/from-kml?$', DeserializeKML.as_view()),
)
