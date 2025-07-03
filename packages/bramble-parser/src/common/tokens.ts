export enum ELexerTokens {
  HASH,             // #
  AT,               // @
  LINE,             // -
  OPERATOR,         // =
  COMMA,            // ,

  KW_CHUNK,         // CHUNK
  KW_FILE,          // FILE
  KW_META,          // META
  KW_DIR,           // DIR
  KW_REF,           // REF
  KW_HIST,          // HIST

  ATT_PARENT,       // parent
  ATT_NAME,         // name
  ATT_SIZE,         // size
  ATT_TAGS,         // tags
  ATT_MODIFIED,     // modified
  ATT_CREATED,      // created
  ATT_MIMETYPE,     // mimetype
  ATT_TO,           // to
  ATT_TYPE,         // type
  ATT_CONTEXT,      // context
  ATT_USER,         // user
  ATT_ACTION,       // action
  ATT_HASH,         // hash

  ID,               // f1a7e, 92e1f
  ROOT,             // root
  STRING,           // text, file name, dir name
  NUMBER,           // 20320
  RANGE,            // 0-999
  TIMESTAMP,        // 2025-07-01T10:21 => 20250701T1021
  MIME_TYPE,        // image/png
  LIST,             // branding,logo

  NEWLINE,          // '\n'
  WHITESPACE,       // ' '
}
