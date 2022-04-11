

# Database Setup

You will need to configure a MySQL database. For ease of use and security, we have opted to use environment variables for this configuration. You will have to define the environment variable 'DATABASE_URL' using the default MYSQL schema as follows:

```
export DATABASE_URL="mysql://mysql_user:mysql_user_pass@localhost/database_name"
```

DATABASE_URL="mysql://mega_translation_user:mega_translation_user@localhost/mega_translation"