import { ErrorCode } from '~/common';
import { HavenException } from '~/errors';
import { FileParser } from './fileParser';
import { DirectorieParser } from './directoryParser';
import { ReferenceParser } from './referenceParser';
import { HistoryParser } from './historyParser';
import { errorManager } from '~/errors/errorManager';

export class BrambleFSParser {
  private chunkMap: ChunkMap[];
  private nodes: HavenFSNode[];
  private references: HavenReference[];
  private history: HavenHistoryTree[];

  constructor(chunkMap: ChunkMap[]) {
    this.chunkMap = chunkMap;
    this.nodes = [];
    this.references = [];
    this.history = [];
  }

  parse(): void {
    for (const chunk of this.chunkMap) {
      switch (chunk.type) {
        case 'files':
          new FileParser(this.nodes, chunk.entries);
          break;

        case 'directories':
          new DirectorieParser(this.nodes, chunk.entries);
          break;

        case 'refs':
          new ReferenceParser(this.references, chunk.entries);
          break;

        case 'history':
          new HistoryParser(this.history, chunk.entries);
          break;

        default:
          const position = { line: 0, column: 0 };
          new HavenException(`Unknown chunk type ${chunk.type}`, position, ErrorCode.UNKNOWN_CHUNK_TYPE);
          break;
      }
    }
  }

  linkData(): void {
    const nodeMap = new Map<string, HavenFSNode>();
    for (const node of this.nodes) {
      nodeMap.set(node.id, node);
    }

    for (const ref of this.references) {
      const fromNode = nodeMap.get(ref.from);

      if (!fromNode) {
        const position = { line: 0, column: 0 };
        new HavenException(`Reference 'from' ID ${ref.from} not found`, position, ErrorCode.MISSING_TOKEN);
        return;
      }

      if (!fromNode.references) {
        fromNode.references = [];
      }
      fromNode.references.push(ref);
    }

    for (const hist of this.history) {
      const histNode = nodeMap.get(hist.id);
      if (!histNode) {
        const position = { line: 0, column: 0 };
        new HavenException(`History ID ${hist.id} not found`, position, ErrorCode.MISSING_TOKEN);
        return;
      }

      if (!histNode.history) {
        histNode.history = [];
      }
      histNode.history.push(hist);
    }
  }

  public toJSON(): string {
    return JSON.stringify(this.nodes)
  }

  public getJSON() {
    return this.nodes
  }

  public run() {
    this.parse();
    this.linkData();
  }

  public debugFS(): void {
    console.log('='.repeat(60));
    console.log(`Total Nodes: ${this.nodes.length}`);
    console.log('='.repeat(60));

    for (const node of this.nodes) {
      console.log(`ID: ${node.id}`);
      console.log(`Type: ${node.type}`);
      console.log(`Name: ${node.name}`);
      console.log(`Parent: ${node.parent}`);
      if (node.size !== undefined) console.log(`Size: ${node.size}`);
      if (node.tags) console.log(`Tags: ${node.tags.join(', ')}`);

      if (node.metadata) {
        console.log(`Metadata:`);
        for (const [key, value] of Object.entries(node.metadata)) {
          console.log(`  - ${key}: ${value}`);
        }
      }

      if (node.references) {
        console.log(`References (${node.references.length}):`);
        for (const ref of node.references) {
          console.log(`  - To: ${ref.to}, Type: ${ref.type}${ref.context ? `, Context: ${ref.context}` : ''}`);
        }
      }

      if (node.history) {
        console.log(`History (${node.history.length}):`);
        for (const h of node.history) {
          console.log(`  - [${h.timestamp}] User: ${h.user}, Action: ${h.action}, Hash: ${h.hash}`);
        }
      }
      console.log('-'.repeat(60));
    }
  }

}


