export const havenfsExample =  [
  {
    id: "f1a7e",
    type: "file",
    parent: "92e1f",
    name: "logo.png",
    size: 20320,
    tags: [ "branding", "logo" ],
    metadata: {
      created: "20240812T1419",
      modified: "20240812T1419",
      mimetype: "image/png",
    },
    references: [
      {
        from: "f1a7e",
        to: "3d93e",
        type: "used-by",
        context: "thumbnail",
      }
    ],
    history: [
      {
        id: "f1a7e",
        timestamp: "20250625T1230",
        user: "ellie",
        action: "created",
        hash: "abc123",
      },
      {
        id: "f1a7e",
        timestamp: "20250626T1010",
        user: "ellie",
        action: "edited",
        hash: "def456",
      }
    ],
  }, {
  id: "f1b88",
  type: "file",
  parent: "92e1f",
  name: "screenshot1.png",
  size: 50320,
  tags: undefined,
  metadata: {
    created: "20240812T1419",
    modified: "20240812T1419",
    mimetype: "image/png",
  },
}, {
  id: "f1c99",
  type: "file",
  parent: "92e2f",
  name: "favicon.ico",
  size: 2048,
  tags: undefined,
  metadata: {
    created: "20240812T1419",
    modified: "20240812T1420",
    mimetype: "image/x-icon",
  },
}, {
  id: "f1d01",
  type: "file",
  parent: "92e3f",
  name: "readme.md",
  size: 1234,
  tags: undefined,
  metadata: {
    created: "20240912T1420",
    modified: "20240912T1419",
    mimetype: "text/markdown",
  },
}, {
  id: "f1d02",
  type: "file",
  parent: "92e3f",
  name: "changelog.md",
  size: 1532,
  tags: undefined,
  metadata: {
    created: "20241012T1420",
    modified: "20241012T1419",
    mimetype: "text/markdown",
  },
}, {
  id: "f1d03",
  type: "file",
  parent: "92e4f",
  name: "api-spec.yaml",
  size: 3321,
  tags: undefined,
  metadata: {
    created: "20241112T1420",
    modified: "20241112T1419",
    mimetype: "application/x-yaml",
  },
}, {
  id: "f1e01",
  type: "file",
  parent: "92e5f",
  name: "demo.mp4",
  size: 15032103,
  tags: undefined,
  metadata: {
    created: "20241212T1420",
    modified: "20241212T1419",
    mimetype: "video/mp4",
  },
}, {
  id: "f1f01",
  type: "file",
  parent: "92e6f",
  name: "build.sh",
  size: 923,
  tags: undefined,
  metadata: {
    created: "20241312T1420",
    modified: "20241312T1419",
    mimetype: "application/x-sh",
  },
}, {
  id: "f1f02",
  type: "file",
  parent: "92e7f",
  name: "upload.ts",
  size: 1430,
  tags: undefined,
  metadata: {
    created: "20241412T1420",
    modified: "20241412T1419",
    mimetype: "application/typescript",
  },
}, {
  id: "92e1f",
  type: "directory",
  parent: "root",
  name: "images",
}, {
  id: "92e2f",
  type: "directory",
  parent: "92e1f",
  name: "icons",
}, {
  id: "92e3f",
  type: "directory",
  parent: "root",
  name: "docs",
}, {
  id: "92e4f",
  type: "directory",
  parent: "92e3f",
  name: "specs",
}, {
  id: "92e5f",
  type: "directory",
  parent: "root",
  name: "videos",
}, {
  id: "92e6f",
  type: "directory",
  parent: "root",
  name: "scripts",
}, {
  id: "92e7f",
  type: "directory",
  parent: "92e6f",
  name: "deploy",
}
]
