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
)


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "created_at",
            "pfp",
            "password",
            "is_guide",
            "is_event_manager",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email)
        instance.username = validated_data.get("username", instance.username)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.is_staff = validated_data.get("is_staff", instance.is_staff)
        instance.is_guide = validated_data.get("is_guide", instance.is_guide)
        instance.is_event_manager = validated_data.get(
            "is_event_manager", instance.is_event_manager
        )

        password = validated_data.get("password", None)
        if password:
            instance.set_password(password)
        instance.save()

        return instance
    
class CustomUserProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = CustomUserProfile
        fields = ['user', 'is_guide', 'is_event_manager']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = CustomUserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        # Assign is_guide and is_event_manager based on input or defaults
        is_guide = validated_data.pop('is_guide', False)
        is_event_manager = validated_data.pop('is_event_manager', False)

        if is_guide:
            Guide.objects.create(user_profile=user)
        elif is_event_manager:
            EventManager.objects.create(user_profile=user)
        else:
            Tourist.objects.create(user_profile=user)

        user_profile = CustomUserProfile.objects.create(user=user, **validated_data)
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
    user_profile = CustomUserSerializer()

    class Meta:
        model = Tourist
        fields = ["user_profile", "contact", "country"]

    def create(self, validated_data):
        user_data = validated_data.pop("user_profile")
        user = CustomUser.objects.create(**user_data)
        tourist = Tourist.objects.create(user_profile=user, **validated_data)
        return tourist


class GuideSerializer(serializers.ModelSerializer):
    user_profile = CustomUserSerializer()

    class Meta:
        model = Guide
        fields = ["user_profile", "contact", "num_tourists_handled", "average_rating"]

    def create(self, validated_data):
        user_data = validated_data.pop("user_profile")
        user = CustomUser.objects.create(**user_data)
        guide = Guide.objects.create(user_profile=user, **validated_data)
        return guide


class EventManagerSerializer(serializers.ModelSerializer):
    user_profile = CustomUserSerializer()

    class Meta:
        model = EventManager
        fields = ["user_profile", "contact", "num_of_events", "average_rating"]

    def create(self, validated_data):
        user_data = validated_data.pop("user_profile")
        user = CustomUser.objects.create(**user_data)
        event_manager = EventManager.objects.create(user_profile=user, **validated_data)
        return event_manager


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
