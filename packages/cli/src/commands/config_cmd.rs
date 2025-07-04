use crate::config::{load, save};

pub fn run(args: &[String]) {
    let mut cfg = load();
    if args.is_empty() {
        println!("chunk_size = {}", cfg.settings.chunk_size);
        println!("auto_sync = {}", cfg.settings.auto_sync);
        println!("compression = {}", cfg.settings.compression);
        for r in &cfg.remotes {
            println!("remote {} => {}", r.name, r.url);
        }
        return;
    }
    if args.len() != 2 {
        println!("Uso: haven config <clave> <valor>");
        return;
    }
    let key = &args[0];
    let value = &args[1];
    match key.as_str() {
        "chunk_size" => match value.parse::<usize>() {
            Ok(v) if v > 0 => cfg.settings.chunk_size = v,
            _ => {
                println!("chunk_size debe ser un entero positivo");
                return;
            }
        },
        "auto_sync" => match value.parse::<bool>() {
            Ok(v) => cfg.settings.auto_sync = v,
            _ => {
                println!("auto_sync debe ser true o false");
                return;
            }
        },
        "compression" => match value.parse::<bool>() {
            Ok(v) => cfg.settings.compression = v,
            _ => {
                println!("compression debe ser true o false");
                return;
            }
        },
        _ => {
            println!("Clave desconocida");
            return;
        }
    }
    if let Err(e) = save(&cfg) {
        eprintln!("Error al guardar la configuración: {e}");
    } else {
        println!("Configuración actualizada");
    }
}
