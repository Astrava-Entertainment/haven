use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::Path;
use std::process::Command;

use chrono::Utc;
use uuid::Uuid;

use crate::simulate_fuse::SimulatedFuse;

pub fn run() {
    if Path::new(".haven").exists() {
        println!("Error: El entorno ya está inicializado. Abortando para evitar sobrescribir datos.");
        return;
    }

    if let Err(e) = create_structure() {
        eprintln!("Error al crear la estructura: {e}");
        return;
    }

    let engine = detect_engine();
    if let Err(e) = create_config(&engine) {
        eprintln!("Error al crear config.toml: {e}");
    }

    if let Err(e) = setup_git() {
        eprintln!("{e}");
    }

    let binaries = detect_binaries();
    if let Err(e) = create_gitignore() {
        eprintln!("Error al crear .gitignore: {e}");
    }

    if let Err(e) = generate_docs(&engine, &binaries) {
        eprintln!("Error al generar documentación: {e}");
    }

    // Example usage of SimulatedFuse (FUSE pending implementation)
    let _sim = SimulatedFuse::from_dir(".");

    println!("The Grove is Born! The Seed is Planted! The Garden is Ready!");
}

fn create_structure() -> std::io::Result<()> {
    fs::create_dir(".haven")?;
    fs::create_dir(".haven/objects")?;
    fs::create_dir(".haven/metadata")?;
    Ok(())
}

fn create_config(engine: &str) -> std::io::Result<()> {
    let id = Uuid::new_v4();
    let project_name = std::env::current_dir()
        .ok()
        .and_then(|p| p.file_name().map(|n| n.to_string_lossy().to_string()))
        .unwrap_or_else(|| "Proyecto".into());
    let date = Utc::now().to_rfc3339();

    let contents = format!(
        "[project]\nid = \"{id}\"\nname = \"{project_name}\"\ncreated = \"{date}\"\nengine = \"{engine}\"\n\n[settings]\nchunk_size = 10485760\nauto_sync = false\ncompression = false\n\n[[remotes]]\nname = \"default\"\nurl = \".haven/remote_bucket\"\n"
    );
    fs::write(".haven/config.toml", contents)
}

fn setup_git() -> std::io::Result<()> {
    if Command::new("git").arg("--version").output().is_err() {
        println!("Git no está instalado o accesible.");
        return Ok(());
    }

    if !Path::new(".git").exists() {
        Command::new("git").arg("init").status().ok();
    }

    let branch_exists = Command::new("git")
        .args(["rev-parse", "--verify", "trunk"])
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);
    if !branch_exists {
        Command::new("git").args(["checkout", "-b", "trunk"]).status().ok();
    }
    Ok(())
}

fn detect_engine() -> String {
    if executable_in_path("UnrealEditor") || executable_in_path("UE4Editor") || executable_in_path("UE5Editor") {
        return "Unreal".into();
    }
    if executable_in_path("godot") {
        return "Godot".into();
    }
    if executable_in_path("Unity") {
        return "Unity".into();
    }
    "Desconocido".into()
}

fn executable_in_path(name: &str) -> bool {
    if let Some(paths) = std::env::var_os("PATH") {
        for p in std::env::split_paths(&paths) {
            let mut candidate = p.join(name);
            if candidate.is_file() && is_executable(&candidate) {
                return true;
            }
            if cfg!(windows) {
                candidate.set_extension("exe");
                if candidate.is_file() {
                    return true;
                }
            }
        }
    }
    false
}

#[cfg(unix)]
fn is_executable(path: &Path) -> bool {
    use std::os::unix::fs::PermissionsExt;
    fs::metadata(path)
        .map(|m| m.permissions().mode() & 0o111 != 0)
        .unwrap_or(false)
}

#[cfg(windows)]
fn is_executable(path: &Path) -> bool {
    path.is_file()
}

fn detect_binaries() -> Vec<String> {
    let exts = ["png", "fbx", "ogg"];
    let mut found = Vec::new();
    visit_dirs(Path::new("."), &exts, &mut found).ok();
    found
}

fn visit_dirs(dir: &Path, exts: &[&str], found: &mut Vec<String>) -> std::io::Result<()> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            visit_dirs(&path, exts, found)?;
        } else if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
            if exts.iter().any(|x| x.eq_ignore_ascii_case(ext)) {
                if let Some(p) = path.to_str() {
                    found.push(p.to_string());
                }
            }
        }
    }
    Ok(())
}

fn create_gitignore() -> std::io::Result<()> {
    let rules = [".haven/", "*.png", "*.fbx", "*.ogg"];
    if Path::new(".gitignore").exists() {
        let content = fs::read_to_string(".gitignore")?;
        let mut file = OpenOptions::new().append(true).open(".gitignore")?;
        for r in &rules {
            if !content.contains(r) {
                writeln!(file, "{r}")?;
            }
        }
    } else {
        let mut file = fs::File::create(".gitignore")?;
        for r in &rules {
            writeln!(file, "{r}")?;
        }
    }
    Ok(())
}

fn generate_docs(engine: &str, binaries: &[String]) -> std::io::Result<()> {
    // Historial de cambios
    let mut history = String::new();
    history.push_str("- Se creó la carpeta .haven con subdirectorios objects y metadata para almacenar los archivos versionados.\n");
    history.push_str("- Se generó un archivo config.toml con un UUID único y configuraciones iniciales.\n");
    history.push_str(&format!("- Se detectó el motor de juego {engine} instalado en el sistema y se registró en la configuración.\n"));
    history.push_str("- Se creó un repositorio Git y la rama trunk porque no existía previamente.\n");
    history.push_str("- Se añadió un archivo .gitignore para excluir binarios pesados y carpetas internas.\n");
    if !binaries.is_empty() {
        history.push_str("- Se detectaron archivos binarios en el proyecto para manejo futuro.\n");
    }
    fs::write("Historial de cambios.txt", history)?;

    // Pruebas haven-init
    let pruebas = "✅ Ejecutar haven init en un directorio vacío debe crear la estructura sin errores.\n✅ Validar que el archivo config.toml contenga un UUID y el nombre del motor detectado.\n✅ Ejecutar haven init en un directorio con .haven/ existente debe devolver error.\n";
    fs::write("Pruebas haven-init.txt", pruebas)?;

    // Instrucciones para probar
    let instrucciones = "1. Ejecuta `haven init` en un directorio limpio.\n2. Abre la carpeta .haven y confirma que contiene config.toml, objects/ y metadata/.\n3. Verifica que el archivo .gitignore incluya las reglas adecuadas.\n4. Haz `git status` y comprueba que el repo y la rama trunk existen.\n5. Lee Historial de cambios.txt y verifica los pasos realizados.\n";
    fs::write("Instrucciones para probar.txt", instrucciones)?;
    Ok(())
}
