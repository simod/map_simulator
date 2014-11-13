from xml.dom import minidom
from django.http import HttpResponse


class KML(object):

    def __init__(self, kml_file):
        self.kml = minidom.parse(kml_file)
        

    def check_name(self):
        name = self.kml.getElementsByTagName('atom:name')
        if not name or not 'jrc-map-simulator' in name[0].firstChild.wholeText:
            return {
                'error': 'The file was not generated from the JRC map simulator'
            }
        else:
            return {
                'success': ''
            }


    def extract_features(self):
        features = { 
            "type": 'FeatureCollection',
            'features': []
            }

        for place in self.kml.getElementsByTagName('Placemark'):
            feature ={
                'geometry': {'type': 'Polygon', 'coordinates':[[]]},
                'properties': {},
                'type': 'Feature'
            }
            coords = place.getElementsByTagName('coordinates')[0].firstChild.wholeText.replace('\n', '').replace('\t','')
            coords = coords.split(' ')[1:-1]
            for coord in coords:
                latlng = coord[:-2].split(',')
                feature['geometry']['coordinates'][0].append([float(latlng[0]),float(latlng[1])])

            metadata = place.getElementsByTagName('Data')
            for data in metadata:
                feature['properties'][data.getAttribute('name')] = data.getElementsByTagName('value')[0].firstChild.wholeText

            features['features'].append(feature)

        return features