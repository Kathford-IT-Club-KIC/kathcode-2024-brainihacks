from rest_framework import serializers
from .models import (
    CustomUser,
    CustomUserProfile,
    Tourist,
    Guide,
    GuideRating,
    EventManager,
    EventManagerRating,
    AgencyRating,
    Agency,
)


from rest_framework import serializers
from .models import CustomUser, CustomUserProfile


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
            "is_active",
            "is_staff",
            "created_at",
            "pfp",
            "is_guide",
            "is_event_manager",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class CustomUserProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = CustomUserProfile
        fields = ["user", "is_guide", "is_event_manager"]

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user_serializer = CustomUserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        user_profile = CustomUserProfile.objects.create(user=user, **validated_data)

        if user_profile.is_guide:
            Guide.objects.create(user_profile=user_profile)
        elif user_profile.is_event_manager:
            EventManager.objects.create(user_profile=user_profile)
        else:
            Tourist.objects.create(user_profile=user_profile)

        return user_profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user")
        user = instance.user

        user_serializer = CustomUserSerializer(user, data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        instance.is_guide = validated_data.get("is_guide", instance.is_guide)
        instance.is_event_manager = validated_data.get(
            "is_event_manager", instance.is_event_manager
        )
        instance.save()

        return instance


class TouristSerializer(serializers.ModelSerializer):
    user_profile = CustomUserProfileSerializer()

    class Meta:
        model = Tourist
        fields = ["user_profile", "contact", "country"]


class GuideSerializer(serializers.ModelSerializer):
    user_profile = CustomUserProfileSerializer()

    class Meta:
        model = Guide
        fields = ["user_profile", "contact", "num_tourists_handled", "average_rating"]


class EventManagerSerializer(serializers.ModelSerializer):
    user_profile = CustomUserProfileSerializer()

    class Meta:
        model = EventManager
        fields = ["user_profile", "contact", "num_of_events", "average_rating"]


class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ["id", "name", "contact", "num_of_tours", "average_rating"]


class GuideRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuideRating
        fields = ["id", "guide", "tourist", "tour", "value"]


class EventManagerRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventManagerRating
        fields = ["id", "eventmanager", "tourist", "event", "value"]


class AgencyRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyRating
        fields = ["id", "agency", "tourist", "tour", "value"]
