//TODO: havenfile type structure
/**
 * HavenFile
 *
 * - name: gitRef/node<string>, - size: number,
 * - mime/type: string, - url: string,
 * - havenRef: Set<HavenFile>[]
 * - tags: HavenTag[]
 * - historyTree: Map<User, Action>[]
 * - timeline: Map<gitHash, HavenFile>[]
 * - variants: Map<havenHash, HavenFile>[] (Rust backend)
 */
// interface HaVenFile {
//   name: string;
//   size: number;
//   mimeType: string;
//   url: string;
//   havenRef: Set<HaVenFile>[];
//   tags: HavenTag[];
//   historyTree: Map<User, Action>[];
//   timeline: Map<string, HaVenFile>[];
//   variants: Map<string, HaVenFile>[];
// }

/** class HavenAction { Action

 - type: Enum<comment,emoji, commit, blame, annotation>
 - content: Map<string, dynamic>(json)
 - metadata: Map<string, dynamic>(json)

 Methods:
 - parseMarkdown
 - parseMetadata }
*/

const objects = {
  asdhjekxjgj: {
      name: {
        ref: "0x1234567890abcdef",
        name: '',
        ext: '.png',
        havenRef: [1234,985746, 65438],
        tags: ["tag1", "tag2", "tag3"],
        historyTree: [
          {
            user: "ellie-me@outlook.com",
            action: "created",
            timestamp: 1690000000000,
            hash: "0x1234567890abcdef",
          },
          {
            user: "ellie-me@outlook.com",
            action: "modified",
            timestamp: 1690000000000,
            hash: "0x1234567890abcdef",
          }
        ]
      }
    },
  jjhyeuk: {
      name: {
        ref: "0x1234567890abcdef",
        name: '',
        ext: '.png',
        havenRef: [1234,985746, 65438],
        tags: ["tag1", "tag2", "tag3"],
        historyTree: [
          {
            user: "ellie-me@outlook.com",
            action: "created",
            timestamp: 1690000000000,
            hash: "0x1234567890abcdef",
          },
          {
            user: "ellie-me@outlook.com",
            action: "modified",
            timestamp: 1690000000000,
            hash: "0x1234567890abcdef",
          }
        ]
      }
    }
}


// Soldier.png
// user:user@email.com
// action:created
// tags:tag1,tag2,tag3
// variants:1,2,3
function searchGlobal(name: string) {
  return Object.keys(objects).filter(key => {
    const object = objects[key];
    //early exit if object is not found
    if (!object) return false;

    //Test regex for actions
    const advancedSearch = new RegExp(`^(user|action|tags|variants):(\\s*\\w+)`, 'i');
    const match = advancedSearch.exec(name);

    const advancedSearchType = match?.values();

    //Switch by type: user, action, tags, variants

    searchByTag()
    searchbyAction()
    searchbyVariant(1)
    searchByUser() // email regex
    //early exit if regex does not match
    if (!match) return searchByName(object.name.name, name);



  });
}

function searchByName(name: string, search: string) {
  return name.toLowerCase().includes(search.toLowerCase());
}
