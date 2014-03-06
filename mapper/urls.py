from django.conf.urls import patterns, include, url

from django.views.generic import TemplateView

from .views import SerializeKML

# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:

    #url(r'^admin/', include(admin.site.urls)),
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^maps/?$', SerializeKML.as_view()),
)
