use std::time::{SystemTime, UNIX_EPOCH};

fn main() {
  let messages = ["Keep going!", "You're doing great!", "Almost there!"];
  let now = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_nanos();
  let idx = (now % messages.len() as u128) as usize;
  println!("{}", messages[idx]);
}

