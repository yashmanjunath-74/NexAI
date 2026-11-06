"""Custom SQLite database wrapper with retry logic for transient errors."""
import time
import logging
from django.db.backends.sqlite3.base import DatabaseWrapper as SQLiteDatabaseWrapper
from django.db.backends.sqlite3.client import DatabaseClient
from django.db.backends.sqlite3.creation import DatabaseCreation
from django.db.backends.sqlite3.introspection import DatabaseIntrospection
from django.db.backends.sqlite3.features import DatabaseFeatures as SQLiteDatabaseFeatures
from django.db.backends.sqlite3.operations import DatabaseOperations as SQLiteDatabaseOperations
from django.db.backends.sqlite3.schema import DatabaseSchemaEditor
from django.db.utils import OperationalError

logger = logging.getLogger(__name__)

# Error codes/messages that indicate transient locking issues
TRANSIENT_ERRORS = (
    "database is locked",
    "database table is locked",
    "UNIQUE constraint failed",
    "Foreign Key constraint failed",
)

class DatabaseFeatures(SQLiteDatabaseFeatures):
    pass

class DatabaseOperations(SQLiteDatabaseOperations):
    pass

class DatabaseWrapper(SQLiteDatabaseWrapper):
    """
    Custom SQLite database wrapper that retries on transient lock errors.
    """
    
    def _retry_on_lock(self, func, *args, **kwargs):
        """Retry a database operation on transient lock errors."""
        max_retries = 5
        base_delay = 0.1  # 100ms
        
        for attempt in range(max_retries):
            try:
                return func(*args, **kwargs)
            except OperationalError as e:
                error_msg = str(e).lower()
                is_transient = any(err in error_msg for err in TRANSIENT_ERRORS)
                
                if is_transient and attempt < max_retries - 1:
                    delay = base_delay * (2 ** attempt)  # exponential backoff
                    logger.warning(
                        f"Database locked, retrying in {delay:.1f}s (attempt {attempt + 1}/{max_retries}): {e}"
                    )
                    time.sleep(delay)
                    continue
                raise

    def execute(self, query, params=None):
        return self._retry_on_lock(super().execute, query, params)

    def executemany(self, query, param_list):
        return self._retry_on_lock(super().executemany, query, param_list)

    def cursor(self):
        cursor = super().cursor()
        # Wrap cursor execute methods too
        original_execute = cursor.execute
        original_executemany = cursor.executemany
        
        def retry_execute(query, params=None):
            return self._retry_on_lock(original_execute, query, params)
        
        def retry_executemany(query, param_list):
            return self._retry_on_lock(original_executemany, query, param_list)
        
        cursor.execute = retry_execute
        cursor.executemany = retry_executemany
        return cursor


# Required for Django database backend
DatabaseClient = DatabaseClient
DatabaseCreation = DatabaseCreation
DatabaseIntrospection = DatabaseIntrospection
DatabaseFeatures = DatabaseFeatures
DatabaseOperations = DatabaseOperations
DatabaseSchemaEditor = DatabaseSchemaEditor