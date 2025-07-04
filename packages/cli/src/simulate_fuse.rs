use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

/// Simple in-memory file system used to simulate FUSE behaviour.
pub struct SimulatedFuse {
    files: HashMap<PathBuf, Vec<u8>>, // path -> content
}

impl SimulatedFuse {
    /// Load all files under `root` into memory.
    pub fn from_dir<P: AsRef<Path>>(root: P) -> std::io::Result<Self> {
        let mut sim = SimulatedFuse { files: HashMap::new() };
        Self::visit(root.as_ref(), &mut sim.files)?;
        Ok(sim)
    }

    fn visit(dir: &Path, map: &mut HashMap<PathBuf, Vec<u8>>) -> std::io::Result<()> {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                Self::visit(&path, map)?;
            } else if path.is_file() {
                map.insert(path.clone(), fs::read(&path)?);
            }
        }
        Ok(())
    }

    /// Returns the content of a file if it exists in memory.
    pub fn read_file<P: AsRef<Path>>(&self, path: P) -> Option<&[u8]> {
        self.files.get(path.as_ref()).map(|v| v.as_slice())
    }

    /// Lists all files under a path prefix.
    pub fn read_dir<P: AsRef<Path>>(&self, path: P) -> Vec<PathBuf> {
        let prefix = path.as_ref();
        self.files
            .keys()
            .filter(|p| p.starts_with(prefix))
            .cloned()
            .collect()
    }
}

