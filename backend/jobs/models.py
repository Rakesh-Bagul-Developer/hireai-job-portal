from django.db import models
from accounts.models import User, EmployerProfile


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True)
    job_count = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
        ('freelance', 'Freelance'),
    ]
    EXPERIENCE_CHOICES = [
        ('fresher', 'Fresher (0-1 yr)'),
        ('junior', 'Junior (1-3 yrs)'),
        ('mid', 'Mid-level (3-5 yrs)'),
        ('senior', 'Senior (5-8 yrs)'),
        ('lead', 'Lead (8+ yrs)'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('draft', 'Draft'),
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    employer_profile = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE,
                                          related_name='jobs', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,
                                  null=True, related_name='jobs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True)
    skills_required = models.TextField(blank=True, help_text='Comma-separated skills')
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full_time')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='junior')
    location = models.CharField(max_length=200)
    is_remote = models.BooleanField(default=False)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default='INR')
    application_deadline = models.DateField(null=True, blank=True)
    vacancies = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    views_count = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.employer_profile.company_name if self.employer_profile else self.employer.username}"

    def get_skills_list(self):
        return [s.strip() for s in self.skills_required.split(',') if s.strip()]


class SavedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'job']

    def __str__(self):
        return f"{self.user.username} saved {self.job.title}"
