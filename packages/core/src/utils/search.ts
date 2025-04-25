import { HavenFile } from "../common/file";

const examples: Record<string, { name: HavenFile }> = {
  soldierFile01: {
    name: {
      ref: "0xabc123def456",
      name: "Soldier_Avatar.png",
      ext: ".png",
      havenRef: [1021, 3948, 7745],
      tags: ["avatar", "military", "character"],
      historyTree: [
        {
          user: "ellie@haven.io",
          action: "created",
          timestamp: 1689000000000,
          hash: "0xabc123def456",
        },
        {
          user: "mario@haven.io",
          action: "renamed",
          timestamp: 1690000000000,
          hash: "0xabc123def456",
        },
      ],
    },
  },
  cityMapV2: {
    name: {
      ref: "0xdef789abc321",
      name: "NeoTokyo_Map.json",
      ext: ".json",
      havenRef: [5555, 8888, 9999],
      tags: ["map", "cyberpunk", "level"],
      historyTree: [
        {
          user: "alexa@haven.io",
          action: "created",
          timestamp: 1691200000000,
          hash: "0xdef789abc321",
        },
        {
          user: "ellie@haven.io",
          action: "modified",
          timestamp: 1691300000000,
          hash: "0xdef789abc321",
        },
      ],
    },
  },
  stealthCharacter: {
    name: {
      ref: "0xfeedcafe1234",
      name: "Stealth_Ninja.glb",
      ext: ".glb",
      havenRef: [2020, 3030, 4040],
      tags: ["character", "stealth", "3d"],
      historyTree: [
        {
          user: "kai@haven.io",
          action: "created",
          timestamp: 1692000000000,
          hash: "0xfeedcafe1234",
        },
        {
          user: "kai@haven.io",
          action: "optimized",
          timestamp: 1692100000000,
          hash: "0xfeedcafe1234",
        },
      ],
    },
  },
};

export function searchGlobal(input: string) {
  return Object.entries(examples)
    .filter(([_, obj]) => {
      const file = obj.name;
      if (!file) return false;

      // Regex: "type:query"
      const advancedSearch = /^(user|action|tags|variants):\s*(.+)$/i;
      const match = input.match(advancedSearch);

      if (match) {
        const [, type, query] = match;

        switch (type.toLowerCase()) {
          case "user":
            return searchByUser(file.historyTree, query);
          case "action":
            return searchByAction(file.historyTree, query);
          case "tags":
            return searchByTag(file.tags, query);
          case "variants":
            return searchByVariant(file.havenRef, query);
          default:
            return false;
        }
      }

      // if there is no specified type: search by name
      return searchByName(file.name, input);
    })
    .map(([key]) => key); // return only hashes
}

export function searchByName(fileName: string, search: string) {
  return fileName.toLowerCase().includes(search.toLowerCase());
}

export function searchByTag(tags: string[], search: string) {
  return tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
}

export function searchByAction(historyTree: any[], search: string) {
  return historyTree.some((entry) =>
    entry.action.toLowerCase().includes(search.toLowerCase())
  );
}

export function searchByUser(historyTree: any[], search: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(search.trim())) return false;

  return historyTree.some((entry) =>
    entry.user.toLowerCase().includes(search.toLowerCase())
  );
}

export function searchByVariant(havenRef: number[], search: string) {
  return havenRef.includes(Number(search.trim()));
}

// export async function searchGlobal(input: string) {
//   const advancedSearch = /^(user|action|tags|variants):\s*(.+)$/i;
//   const match = input.match(advancedSearch);

//   if (match) {
//     const [, type, query] = match;
//     switch (type.toLowerCase()) {
//       case "user":
//         return await HavenApi.searchByUser(query);
//       case "action":
//         return await HavenApi.searchByAction(query);
//       case "tags":
//         return await HavenApi.searchByTag(query);
//       case "variants":
//         return await HavenApi.searchByVariant(query);
//     }
//   }

//   return await HavenApi.searchByName(input);
// }
