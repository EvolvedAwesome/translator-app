# Translator app using Rust and jQuery

Translator app uses a jQuery frontend and a Rust backend to provide CRUD operations on a MySQL database backend. Restricted to using jQuery for the front-end interface. Uses Rust libraries Rocket and Diesel. Written under time restriction.

## Running the webserver in development mode

You will need to install `cargo` and the `diesel cli` and clone the project. To do this, run:

```
curl https://sh.rustup.rs -sSf | sh # If you live dangerously
cargo install diesel_cli --no-default-features --features "mysql"
```

Then clone the project:

```
git clone PROJECT_URL translator_stack
cd translator_stack
```

Complete the database setup steps below (including the diesel migrations)

Run the application with:

```
cargo run
```

This will download the required dependencies and then compile the application for your local OS/Arch. Once finished, you can view the application at `http://127.0.0.1:8000`.

## Database Setup

You will need to configure a MySQL database. For ease of use and security, we have opted to use environment variables for this configuration. You will have to define the environment variable 'DATABASE_URL' using the default MYSQL schema and validate it with diesel as follows:

```
export DATABASE_URL="mysql://mysql_user:mysql_user_pass@localhost/database_name"
diesel setup
```

then add the `url` to a new file named `Rocket.toml` in the project directory like:

```
[global.databases.translations]
url = "mysql://mysql_user:mysql_user_pass@localhost/database_name"
pool_size = 10
timeout = 5
```

**Note:** Diesel needs both the environment variable and the Rocket.toml file to work as expected.

You can then run the diesel migrations to create the table:

```
diesel migration run
````

## Deploying to production

We reccomend using docker to deploy by building the binaries in a Dockerfile. You will need to bundle the static assets explicitly. You **should** run this application behind a reverse proxy such as traefik 2.0, haproxy or nginx-proxy to handle SSL.

This application can be deployed directly as a docker service, or as an AWS lambda service using:

https://crates.io/crates/lambda-web