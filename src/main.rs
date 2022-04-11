#[macro_use] extern crate rocket;
use rocket::serde::{Deserialize, Serialize};
use rocket::serde::json::Json; 

use rocket_contrib::serve::StaticFiles;

fn main() {
    rocket::ignite()
        .mount("/", StaticFiles::from("/static"))
        .launch();
}
