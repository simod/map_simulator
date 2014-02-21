from django.conf.urls import patterns, include, url

#from .views import Poly2Kml
from django.views.generic import TemplateView

# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mapper.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    #url(r'^admin/', include(admin.site.urls)),
    #url(r'^kml/', Poly2Kml.as_view(), name='kml'),
    url(r'^$', TemplateView.as_view(template_name='index.html')),
)
