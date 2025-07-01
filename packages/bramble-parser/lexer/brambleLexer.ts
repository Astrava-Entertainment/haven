import * as fs from 'fs'
import {ELexerTokens, IChunkBlock, ILexerToken} from "./brambleToken";
import { LexerRules } from "./BrambleLexerRule";

class BrambleLexer {
  documentContent: string;
  tokens: ILexerToken[];
  tokensByLine: ILexerToken[][]
  chunks: IChunkBlock[];


  constructor(document: string) {
    this.tokens = [];
    this.tokensByLine = [];
    this.chunks = [];
    this.documentContent = fs.readFileSync(document, 'utf8');
  }

  tokenize() {
    let remaining = this.documentContent;
    while (remaining.length > 0)
    {
      let matched = false
      for (const rule of LexerRules) {
        const match = rule.pattern.exec(remaining);
        if (match) {
          this.tokens.push({ type: rule.tokenToMatch, value: match[0] });
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        throw new Error(`Unrecognized token: ${remaining[0]}`);
      }
    }
  }

  groupTokensByLine() {
    let currentLine: ILexerToken[] = [];
    for (const token of this.tokens) {
      if (token.type === ELexerTokens.NEWLINE) {
        if (currentLine.length > 0) {
          this.tokensByLine.push(currentLine);
          currentLine = [];
        }
      } else {
        currentLine.push(token);
      }
    }
    if (currentLine.length > 0) {
      this.tokensByLine.push(currentLine);
    }
  }

  private tryExtractChunkType(token: ILexerToken[], index: number) {
    const keywordToken = token[1];
    if (keywordToken.type !== ELexerTokens.KW_CHUNK) {
      throw new Error(`Invalid chunk declaration at line ${index + 1}`)
    }

    const chunkTypeToken = token[3];
    if (!chunkTypeToken || chunkTypeToken.type !== ELexerTokens.STRING) {
      throw new Error(`Missing chunk type at line ${index + 1}`)
    }

    return chunkTypeToken.value;
  }

  groupByChunkContext() {
    const allowedByChunk: Record<string, ELexerTokens[]> = {
      files: [ELexerTokens.KW_FILE, ELexerTokens.KW_META],
      directories: [ELexerTokens.KW_DIR],
      refs: [ELexerTokens.KW_REF],
      history: [ELexerTokens.KW_HIST],
    };

    let currentChunkType: string | null = null;
    let currentChunkHeader: ILexerToken[] = [];
    let currentChunkLines: ILexerToken[][] = [];

    const flushCurrentChunks = () => {
      if (currentChunkType) {
        this.chunks.push({
          type: currentChunkType,
          headerTokens: currentChunkHeader,
          lines: currentChunkLines,
        })
      }
      currentChunkType = null;
      currentChunkHeader = [];
      currentChunkLines = [];
    }
    this.tokensByLine.forEach((token, index) => {
      if (token.length === 0) return;
      const firstToken = token[0];

      // Is head of chunk context
      if (firstToken.type === ELexerTokens.HASH) {
        flushCurrentChunks();

        const keywordToken = token[1];
        if (keywordToken.type !== ELexerTokens.KW_CHUNK) {
          throw new Error(`Invalid chunk declaration at line ${index + 1}`)
        }

        const chunkTypeToken = token[3];
        if (!chunkTypeToken || chunkTypeToken.type !== ELexerTokens.STRING) {
          throw new Error(`Missing chunk type at line ${index + 1}`)
        }

        currentChunkType = chunkTypeToken.value;
        currentChunkHeader = token
        console.log(`Current chunk context: ${currentChunkType}`);
        return;
      }

      if (currentChunkType) {
        const allowedTokens = allowedByChunk[currentChunkType];
        if (!allowedTokens) {
          throw new Error(`Unknown chunk type at line ${index + 1}`)
        }

        const firstTokenType = firstToken.type;
        if (!allowedTokens.includes(firstTokenType)) {
          throw new Error(`Invalid chunk type ${ELexerTokens[firstTokenType]} at line ${index + 1}`)
        }
        currentChunkLines.push(token)
        // console.log(`Current line: ${ELexerTokens[firstTokenType]} at line ${index + 1}`);
      }
    })
    flushCurrentChunks();
  }

  debugChunks() {
    console.log("=".repeat(50));
    console.log(`Found ${this.chunks.length} chunks`);
    console.log("=".repeat(50));
    for (const chunk of this.chunks) {
      console.log(`Chunk type: ${chunk.type}`);
      console.log("Header:", chunk.headerTokens.map(t => `[${ELexerTokens[t.type]}]`).join(" "));
      console.log(`Contains ${chunk.lines.length} lines`);
      for (const line of chunk.lines) {
        console.log(
          "  - " + line.map(t => `[${ELexerTokens[t.type]}]`).join(" ")
        );
      }
      console.log("-".repeat(50));
    }
  }

  debugReadTokensByLine() {
    this.tokensByLine.forEach((line, index) => {
      console.log('='.repeat(40));
      console.log(`Line ${index + 1}:`);
      for (const token of line) {
        const tokenName = ELexerTokens[token.type];
        console.log(`  [${tokenName}] ${token.value}`);
      }
      if (line.length === 0) {
        console.log('  (empty line)');
      }
    });
    console.log('='.repeat(40));
  }
}

// Example usage:
const myClass = new BrambleLexer('./fixtures/example.havenfs');
myClass.tokenize();
myClass.groupTokensByLine();
myClass.groupByChunkContext();
myClass.debugChunks();
