from rest_framework import serializers
from .models import Job, Category, SavedJob
from accounts.serializers import EmployerProfileSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.get_full_name', read_only=True)
    company_name = serializers.CharField(source='employer_profile.company_name', read_only=True)
    company_logo = serializers.ImageField(source='employer_profile.company_logo', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    skills_list = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['employer', 'employer_profile', 'views_count', 'created_at', 'updated_at']

    def get_skills_list(self, obj):
        return obj.get_skills_list()

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = ['employer', 'employer_profile', 'views_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['employer'] = user
        try:
            validated_data['employer_profile'] = user.employer_profile
        except Exception:
            pass
        return super().create(validated_data)


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = '__all__'
        read_only_fields = ['user']
