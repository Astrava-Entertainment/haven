use std::fs::{self, OpenOptions, File};
use std::io::{self, Write};
use std::net::SocketAddr;
use std::path::Path;
use uuid::Uuid;

/// Information about a peer discovered on the network.
#[derive(Clone, Debug)]
pub struct PeerInfo {
    pub id: Uuid,
    pub addr: SocketAddr,
}

/// Read the known peers file to simulate mDNS discovery.
/// In a real implementation this would use `iroh` with mDNS.
fn discover_peers() -> io::Result<Vec<PeerInfo>> {
    let mut peers = Vec::new();
    let path = Path::new(".haven/known_peers");
    if let Ok(data) = fs::read_to_string(path) {
        for line in data.lines() {
            if let Some((id, addr)) = line.split_once(',') {
                if let (Ok(id), Ok(addr)) = (Uuid::parse_str(id), addr.parse()) {
                    peers.push(PeerInfo { id, addr });
                }
            }
        }
    }
    Ok(peers)
}

/// Attempt to synchronize with all discovered peers.
/// Only differences in object hashes are transferred.
pub fn sync_with_peers(log: &mut File) -> io::Result<()> {
    let peers = discover_peers()?;
    for peer in peers {
        match sync_peer(&peer) {
            Ok(_) => writeln!(log, "p2p_sync {} success", peer.id)?,
            Err(e) => {
                writeln!(log, "p2p_sync {} fail {e}", peer.id)?;
                record_failed(&peer)?;
            }
        }
    }
    retry_failed(log)
}

/// Synchronize with a single peer.
fn sync_peer(_peer: &PeerInfo) -> io::Result<()> {
    // Placeholder for Merkle tree comparison and selective transfer.
    // Real implementation would use `iroh` crates to establish a connection
    // and request missing objects in chunks, validating hashes on receipt.
    Ok(())
}

/// Record a failed attempt for offline reconciliation.
fn record_failed(peer: &PeerInfo) -> io::Result<()> {
    let mut f = OpenOptions::new()
        .create(true)
        .append(true)
        .open(".haven/p2p_failed.log")?;
    writeln!(f, "{},{}", peer.id, peer.addr)
}

/// Retry previously failed peers.
fn retry_failed(log: &mut File) -> io::Result<()> {
    let path = Path::new(".haven/p2p_failed.log");
    if !path.exists() {
        return Ok(());
    }
    let data = fs::read_to_string(path)?;
    fs::remove_file(path)?;
    for line in data.lines() {
        if let Some((id, addr)) = line.split_once(',') {
            if let (Ok(id), Ok(addr)) = (Uuid::parse_str(id), addr.parse()) {
                let peer = PeerInfo { id, addr };
                if sync_peer(&peer).is_err() {
                    // keep failed entry for next run
                    record_failed(&peer)?;
                } else {
                    writeln!(log, "p2p_retry {} success", peer.id)?;
                }
            }
        }
    }
    Ok(())
}
