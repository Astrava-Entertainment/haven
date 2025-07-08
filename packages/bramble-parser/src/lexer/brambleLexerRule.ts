import { ELexerTokens } from "~/common";

class BrambleLexerRule {
  pattern: RegExp;
  tokenToMatch: ELexerTokens;
  constructor(_pattern: RegExp, _tokenToMatch: ELexerTokens) {
    this.pattern = _pattern;
    this.tokenToMatch = _tokenToMatch;
  }
}

export const LexerRules: BrambleLexerRule[] = [
  new BrambleLexerRule(/^#/, ELexerTokens.HASH),
  new BrambleLexerRule(/^@/, ELexerTokens.AT),
  new BrambleLexerRule(/^-/, ELexerTokens.LINE),
  new BrambleLexerRule(/^=/, ELexerTokens.OPERATOR),
  new BrambleLexerRule(/^,/, ELexerTokens.COMMA),

  new BrambleLexerRule(/^CHUNK\b/, ELexerTokens.KW_CHUNK),
  new BrambleLexerRule(/^FILE\b/, ELexerTokens.KW_FILE),
  new BrambleLexerRule(/^META\b/, ELexerTokens.KW_META),
  new BrambleLexerRule(/^DIR\b/, ELexerTokens.KW_DIR),
  new BrambleLexerRule(/^REF\b/, ELexerTokens.KW_REF),
  new BrambleLexerRule(/^HIST\b/, ELexerTokens.KW_HIST),

  new BrambleLexerRule(/^parent\b/, ELexerTokens.ATT_PARENT),
  new BrambleLexerRule(/^name\b/, ELexerTokens.ATT_NAME),
  new BrambleLexerRule(/^size\b/, ELexerTokens.ATT_SIZE),
  new BrambleLexerRule(/^tags\b/, ELexerTokens.ATT_TAGS),
  new BrambleLexerRule(/^modified\b/, ELexerTokens.ATT_MODIFIED),
  new BrambleLexerRule(/^created\b/, ELexerTokens.ATT_CREATED),
  new BrambleLexerRule(/^mimetype\b/, ELexerTokens.ATT_MIMETYPE),
  new BrambleLexerRule(/^to\b/, ELexerTokens.ATT_TO),
  new BrambleLexerRule(/^type\b/, ELexerTokens.ATT_TYPE),
  new BrambleLexerRule(/^context\b/, ELexerTokens.ATT_CONTEXT),
  new BrambleLexerRule(/^user\b/, ELexerTokens.ATT_USER),
  new BrambleLexerRule(/^action\b/, ELexerTokens.ATT_ACTION),
  new BrambleLexerRule(/^hash\b/, ELexerTokens.ATT_HASH),

  new BrambleLexerRule(/^[a-f0-9]+\b/i, ELexerTokens.ID),
  new BrambleLexerRule(/^root\b/, ELexerTokens.ROOT),
  new BrambleLexerRule(/^\d+-\d+/, ELexerTokens.RANGE),
  new BrambleLexerRule(/^\d{8}T\d{4}/, ELexerTokens.TIMESTAMP),
  new BrambleLexerRule(/^[a-z]+\/[a-z0-9\-\.+]+/i, ELexerTokens.MIME_TYPE),
  new BrambleLexerRule(/^[^ \s#@=]+(,[^ \s#@=]+)+/, ELexerTokens.LIST),
  new BrambleLexerRule(/^\d+/, ELexerTokens.NUMBER),
  new BrambleLexerRule(/^[a-zA-Z0-9_\-\.\/]+/, ELexerTokens.STRING),

  new BrambleLexerRule(/^\n/, ELexerTokens.NEWLINE),
  new BrambleLexerRule(/^[ \t]+/, ELexerTokens.WHITESPACE),
];
