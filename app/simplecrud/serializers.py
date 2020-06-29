from rest_framework import serializers
from simplecrud.models import People


class PeopleSerializer(serializers.ModelSerializer):
    queryset = People.objects.all()

    class Meta:
        model = People
        fields = ['name', 'age', 'nationality']
