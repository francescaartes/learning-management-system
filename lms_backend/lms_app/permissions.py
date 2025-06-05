from rest_framework import permissions

class IsInstructorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow the instructor of a course or lesson to edit it.
    Everyone else has read-only access.
    """

    def has_object_permission(self, request, view, obj): 
        if request.method in permissions.SAFE_METHODS:
            return True

        if hasattr(obj, 'instructor'):
            return obj.instructor == request.user

        if hasattr(obj, 'course') and hasattr(obj.course, 'instructor'):
            return obj.course.instructor == request.user

        return False
