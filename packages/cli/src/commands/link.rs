use std::fs::{self, File};
use std::io::Write;
use std::path::Path;

use crate::config::{load, save, Remote};

pub fn run(args: &[String]) {
    if args.is_empty() {
        println!("Uso: haven link <bucket_url>");
        return;
    }
    let url = &args[0];
    let path = Path::new(url);
    if let Err(e) = fs::create_dir_all(path.join("objects")) {
        eprintln!("No se puede acceder al bucket: {e}");
        return;
    }
    if let Err(e) = fs::create_dir_all(path.join("metadata")) {
        eprintln!("No se puede acceder al bucket: {e}");
        return;
    }
    let test_file = path.join(".haven_test");
    match File::create(&test_file).and_then(|mut f| f.write_all(b"test")) {
        Ok(_) => { let _ = fs::remove_file(&test_file); },
        Err(e) => {
            eprintln!("No se pudo escribir en el bucket: {e}");
            return;
        }
    }
    let mut cfg = load();
    let name = format!("remote{}", cfg.remotes.len() + 1);
    cfg.remotes.push(Remote { name: name.clone(), url: url.clone() });
    if let Err(e) = save(&cfg) {
        eprintln!("Error al guardar la configuración: {e}");
    } else {
        println!("Bucket enlazado como {name}");
    }
}
