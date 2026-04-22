from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared Limiter instance — imported by main.py (for state + error handler)
# and by route modules (for @limiter.limit decorators). Kept in its own module
# to avoid circular imports with app.main.
limiter = Limiter(key_func=get_remote_address)
