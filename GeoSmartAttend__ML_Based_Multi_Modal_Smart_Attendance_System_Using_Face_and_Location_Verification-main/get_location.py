import geocoder

g = geocoder.ip('me')
print("Latitude:", g.latlng[0])
print("Longitude:", g.latlng[1])
