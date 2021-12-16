pub mod board;
pub mod game;
pub mod player;
pub mod util;

use fueros_derive::JsEnum;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use web_sys::console;

#[derive(Serialize, Deserialize, JsEnum, Clone, Copy)]
pub enum Values {
    First { value: i32 },
    Second,
}

#[wasm_bindgen]
impl Values {}

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    // Your code goes here!
    console::log_1(&JsValue::from_str("Hello my world!"));

    Ok(())
}
