from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from .models import Job, Category, SavedJob
from .serializers import JobSerializer, JobCreateSerializer, CategorySerializer, SavedJobSerializer


class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'skills_required', 'location']
    ordering_fields = ['created_at', 'salary_min', 'views_count']

    def get_queryset(self):
        qs = Job.objects.filter(status='active')
        params = self.request.query_params

        job_type = params.get('job_type')
        if job_type:
            qs = qs.filter(job_type=job_type)

        category = params.get('category')
        if category:
            qs = qs.filter(category__slug=category)

        experience = params.get('experience')
        if experience:
            qs = qs.filter(experience_level=experience)

        location = params.get('location')
        if location:
            qs = qs.filter(location__icontains=location)

        is_remote = params.get('is_remote')
        if is_remote == 'true':
            qs = qs.filter(is_remote=True)

        salary_min = params.get('salary_min')
        if salary_min:
            qs = qs.filter(salary_min__gte=salary_min)

        q = params.get('q')
        if q:
            qs = qs.filter(
                Q(title__icontains=q) |
                Q(description__icontains=q) |
                Q(skills_required__icontains=q) |
                Q(location__icontains=q)
            )
        return qs.select_related('employer', 'employer_profile', 'category')


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)


class JobCreateView(generics.CreateAPIView):
    serializer_class = JobCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


class JobUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(employer=self.request.user)


class EmployerJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(employer=self.request.user)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_save_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=404)

    saved, created = SavedJob.objects.get_or_create(user=request.user, job=job)
    if not created:
        saved.delete()
        return Response({'saved': False, 'message': 'Job removed from saved.'})
    return Response({'saved': True, 'message': 'Job saved successfully.'})


class SavedJobsView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related('job')


class FeaturedJobsView(generics.ListAPIView):
    queryset = Job.objects.filter(status='active', is_featured=True).order_by('-created_at')[:6]
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
